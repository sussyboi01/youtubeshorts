const fetch = require('node-fetch');
const fs = require('fs');

const TOPICS = [
  "Daily mini‑vlogs", 
  "Behind‑the‑scenes workspace",
  "Quick how‑to",
  "Life hacks",
  "Before-and-after transformations",
  "Food videos",
  "Pet/animal videos",
  "DIY / craft projects",
  "Product reviews / unboxing",
  "Tech / gadget demos",
  "Gaming clips",
  "Sports / extreme sports clips",
  "Fitness / workout snippets",
  "Fashion / try-on haul",
  "Beauty / makeup quick changes",
  "Reaction videos",
  "Memes / comedy skits",
  "Trend challenges / viral audio & dance",
  "Nostalgia content",
  "Short educational facts / trivia",
  "Myth vs fact videos",
  "Time-lapse / fast-motion sequences",
  "ASMR / satisfying visuals",
  "What happens if experiments",
  "Day in the life of a certain job",
  "X things you didn't know about Y",
  "Travel / local spots",
  "Car / bike / e-bike clips",
  "Did you know? science / tech facts",
  "Motivational / inspirational",
  "POV style videos",
  "Trending sounds / remixing audio",
  "Mini stories / anecdotes",
  "What I spend in a day / finances",
  "Productivity / workspace setups",
  "Gaming tutorials / tips",
  "Music clips / lip-sync",
  "Virtual avatars / VTuber clips",
  "Faceless videos",
  "Travel hack / packing tips",
  "Home decor / room makeovers",
  "Tech repair / modding / build process",
  "Life in city/country / cultural snippets",
  "Reaction to current events",
  "Shopping hauls / thrift / upcycling",
  "Why I switched to... / pros & cons",
  "Quick book / movie / game reviews",
  "One minute challenge / timed tasks",
  "Unusual / niche hobbies",
  "Behind-the-brand / small business intro"
];

// Utility: shuffle an array
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Fetch videos from YouTube for a single topic
async function fetchVideos(topic) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=id&type=video&videoDuration=short&q=${encodeURIComponent(topic)}&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error(`YouTube API error for topic "${topic}":`, data.error);
      return [];
    }

    if (!data.items || data.items.length === 0) {
      console.warn(`No videos found for topic "${topic}"`);
      return [];
    }

    return data.items.map(i => i.id.videoId).filter(id => !!id);
  } catch (err) {
    console.error(`Fetch error for topic "${topic}":`, err);
    return [];
  }
}

// Main function
(async () => {
  console.log("Generating new YouTube Shorts feed...");

  let feed = [];

  for (let topic of TOPICS) {
    const videos = await fetchVideos(topic);
    feed.push(...videos);
    console.log(`Fetched ${videos.length} videos for topic: ${topic}`);
  }

  // Deduplicate and shuffle
  feed = shuffleArray([...new Set(feed)]);

  // Save feed.json
  fs.writeFileSync('feed.json', JSON.stringify(feed, null, 2));
  console.log(`Feed generated with ${feed.length} videos.`);
})();
