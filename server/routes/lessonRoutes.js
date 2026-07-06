const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { generateLesson } = require("../controllers/courseController");
const markLessonCompleted = require("../controllers/markLessonCompleted");
const markLessonIncomplete = require("../controllers/markLessonIncomplete");

// POST /api/lessons/:lessonId/generate
router.post("/:lessonId/generate", requireAuth, generateLesson);
router.patch("/:id/complete", markLessonCompleted);
router.patch("/:id/incomplete", markLessonIncomplete);

module.exports = router;
