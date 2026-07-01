const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/auth");
const { searchYouTube } = require("../controllers/youtubeController");

// GET /api/youtube/search?query=...
router.get("/search", requireAuth, searchYouTube);

module.exports = router;
