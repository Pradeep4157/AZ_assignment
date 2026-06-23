const express = require("express");
const router = express.Router();
const { generateLesson } = require("../controllers/courseController");

router.post("/:lessonId/generate", generateLesson);

module.exports = router;
