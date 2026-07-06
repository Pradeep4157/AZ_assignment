const Lesson = require("../models/Lesson");
const markLessonCompleted = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      {
        completed: true,
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

module.exports = markLessonCompleted;
