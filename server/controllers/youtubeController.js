const Lesson = require("../models/Lesson"); // Make sure to import your Lesson model [cite: 58]

const searchYouTube = async (req, res) => {
  try {
    const { query, lessonId } = req.query; // 🔑 Grab lessonId from the request query
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query string parameter is required.",
      });
    }

    // 1. ⚡ OPTIMIZATION: Check DB first if lessonId is provided
    if (lessonId) {
      const lesson = await Lesson.findById(lessonId);
      if (lesson && lesson.content) {
        // Find the specific video block that matches this search query
        const existingVideoBlock = lesson.content.find(
          (block) =>
            block.type === "video" &&
            (block.search_query === query || block.query === query),
        );

        // If it already has a saved videoId, return it immediately!
        if (existingVideoBlock && existingVideoBlock.videoId) {
          console.log(
            `🎯 Quota Saved! Found cached videoId in DB for query: ${query}`,
          );
          return res.status(200).json({
            success: true,
            videoId: existingVideoBlock.videoId,
            title: existingVideoBlock.caption || "Saved Lesson Video",
            cached: true,
          });
        }
      }
    }

    // 2. 🚨 FALLBACK: If not found in DB, hit the official YouTube Data API v3 [cite: 176, 179]
    console.log(`🌐 Hitting YouTube API for query: ${query}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&videoEmbeddable=true&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No structural video matches found on YouTube registry.",
      });
    }

    const videoId = data.items[0].id.videoId;
    const snippet = data.items[0].snippet;

    // 3. 💾 PERSIST TO DB: Update the specific block inside the lesson document so it's cached forever
    if (lessonId) {
      await Lesson.updateOne(
        { _id: lessonId, "content.search_query": query },
        { $set: { "content.$.videoId": videoId } }, // The '$' positional operator modifies the exact matched block
      );
      console.log("💾 Successfully cached videoId into MongoDB.");
    }

    return res.status(200).json({
      success: true,
      videoId,
      title: snippet.title,
      thumbnail: snippet.thumbnails.high.url,
    });
  } catch (error) {
    console.error("YouTube compilation stream failure:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { searchYouTube };
