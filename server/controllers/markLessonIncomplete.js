const Lesson = require("../models/Lesson");

const markLessonIncomplete = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        completed: false,
      },
      {
        new: true,
      },
    );

    res.json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = markLessonIncomplete;
