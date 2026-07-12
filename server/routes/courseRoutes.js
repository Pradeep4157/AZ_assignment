const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth"); // Our security gatekeeper

// Import the controller functions
const {
  createCourseFlow,
  getCourseById,
  getUserCourses,
  deleteCourse,
} = require("../controllers/courseController");

/**
 * @route   POST /api/courses/generate
 * @desc    Generate a new course outline and save placeholders to DB
 * @access  Private (Requires Token)
 */
router.post("/generate", requireAuth, createCourseFlow);

/**
 * @route   GET /api/courses
 * @desc    Get a list of all courses belonging to the logged-in user
 * @access  Private (Requires Token)
 */
router.get("/", requireAuth, getUserCourses);
router.delete("/:id", requireAuth, deleteCourse);

/**
 * @route   GET /api/courses/:id
 * @desc    Get a single course with deeply populated modules and lessons
 * @access  Public or Private (See note below)
 */
router.get("/:id", getCourseById);

module.exports = router;
