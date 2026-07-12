const Lesson = require("../models/Lesson");
const { translateLessonContent } = require("../services/lessonTranslator");

const translateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { language } = req.body;
    const userId = req.user.userId;

    if (!language) {
      return res.status(400).json({
        success: false,
        message: "Language is required.",
      });
    }

    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      populate: {
        path: "course",
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    if (lesson.module.course.creator.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!lesson.isEnriched) {
      return res.status(400).json({
        success: false,
        message: "Generate the lesson before translating.",
      });
    }

    const cachedTranslation = lesson.translations.get(language);

    if (cachedTranslation) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedTranslation,
      });
    }

    const translatedContent = await translateLessonContent(
      lesson.content,
      language,
    );

    lesson.translations.set(language, {
      content: translatedContent,
      generatedAt: new Date(),
      model: "gemini-3.1-flash-lite",
    });

    await lesson.save();

    return res.status(200).json({
      success: true,
      cached: false,
      data: lesson.translations.get(language),
    });
  } catch (err) {
    console.error("Translate Lesson Controller:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = translateLesson;
