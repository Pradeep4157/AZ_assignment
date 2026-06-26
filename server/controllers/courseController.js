/*

*/
const Course = require("../models/Course");
const temp;
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const {
  generateCourse,
  generateLessonContent,
} = require("../services/aiService");

const createCourseFlow = async (req, res) => {
  try {
    const { topic, creator } = req.body;
    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic and creator are required fields.",
      });
    }

    const aiOutline = await generateCourse(topic);
    if (!aiOutline || !Array.isArray(aiOutline.modules)) {
      throw new Error("Invalid AI Response format");
    }

    const course = await Course.create({
      prompt: topic,
      title: aiOutline.title,
      description: aiOutline.description || "",
      creator: creator,
      modules: [],
    });

    for (const moduleData of aiOutline.modules) {
      const moduleInstance = await Module.create({
        title: moduleData.title,
        course: course._id,
        lessons: [],
      });

      for (const lessonData of moduleData.lessons) {
        const lessonInstance = await Lesson.create({
          title: lessonData.title,
          content: [],
          isEnriched: false,
          module: moduleInstance._id,
        });

        moduleInstance.lessons.push(lessonInstance._id);
      }

      await moduleInstance.save();

      course.modules.push(moduleInstance._id);
    }

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Course architecture successfully compiled and saved.",
      courseId: course._id,
    });
  } catch (error) {
    console.error("Course Flow Controller Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }); // Newest first
    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
// generateLessonContent requires courseTitle, moduleTitle, lessonTitle. we have stored course._id, lesson._id, in the module so we can get it from there and send it here.
const generateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId).populate({
      path: "module",
      populate: {
        path: "course",
      },
    });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }
    if (lesson.isEnriched) {
      return res.status(200).json({
        success: true,
        data: lesson,
      });
    }
    const courseTitle = lesson.module.course.title;
    const moduleTitle = lesson.module.title;
    const lessonTitle = lesson.title;
    const lessonBlocks = await generateLessonContent(
      courseTitle,
      moduleTitle,
      lessonTitle,
    );
    lesson.content = lessonBlocks;
    lesson.isEnriched = true;
    await lesson.save();
    return res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.log("Lesson generation error", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createCourseFlow,
  getCourseById,
  getAllCourses,
  generateLesson,
};
