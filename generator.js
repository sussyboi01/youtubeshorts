const fetch = require('node-fetch');
const fs = require('fs');

// The single query: #shorts
const QUERY = "#shorts";

// Utility: shuffle an array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Fetch videos from YouTube
async function fetchVideos() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=id&type=video&videoDuration=short&q=${encodeURIComponent(QUERY)}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;
  
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error("YouTube API error:", data.error);
    return [];
  }

  if (!data.items || data.items.length === 0) {
    console.warn("No videos found for #shorts");
    return [];
  }

  return data.items.map(i => i.id.videoId).filter(id => !!id);
}

// Main function
(async () => {
  console.log("Generating new YouTube Shorts feed with #shorts...");

  let feed = await fetchVideos();

  // Deduplicate
  feed = [...new Set(feed)];
  // Shuffle
  feed = shuffleArray(feed);

  // Save feed.json
  fs.writeFileSync('feed.json', JSON.stringify(feed, null, 2));
  console.log(`Feed generated with ${feed.length} videos.`);
})();
