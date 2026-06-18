const express = require("express");
const router = express.Router();

// Import the controller functions we built earlier
const {
  createCourseFlow,
  getCourseById,
  getAllCourses,
} = require("../controllers/courseController");

/**
 * @route   POST /api/courses/generate
 * @desc    Generate a new course outline using Ollama and save placeholders to DB
 */
router.post("/generate", createCourseFlow);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course with deeply populated modules and lessons
 */
router.get("/:id", getCourseById);

/**
 * @route   GET /api/courses
 * @desc    Get a list of all courses (useful for the dashboard)
 */
router.get("/", getAllCourses);

module.exports = router;
