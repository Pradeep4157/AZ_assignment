const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { generateLesson } = require("../controllers/courseController");

// POST /api/lessons/:lessonId/generate
router.post("/:lessonId/generate", requireAuth, generateLesson);

module.exports = router;
