// Controller function
const searchYouTube = async (req, res) => {
  try {
    const { query } = req.query;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query string parameter is required.",
      });
    }

    // Hit the official YouTube Data API v3 endpoint
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=1&type=video&videoEmbeddable=true&key=${apiKey}`;

    const response = await fetch(url); // native fetch in Node 22
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No structural video matches found on YouTube registry.",
      });
    }

    // Extract the top 1 video ID
    const videoId = data.items[0].id.videoId;
    const snippet = data.items[0].snippet;

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
