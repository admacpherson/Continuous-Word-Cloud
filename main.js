import { loadCSV } from './load_csv.js';
import { cleanupOffscreenClouds } from './cleanup_clouds.js';
import { xOffset, gapBetweenClouds, maxClouds, createWordCloud } from './create_wordclouds.js'


function startScrollingClouds(words, speed) {
  setInterval(() => {
    createWordCloud(words);  // Generate a new word cloud every interval
    cleanupOffscreenClouds();  // Clean up old clouds off-screen
  }, speed * 1000); // Speed in seconds (time between new word clouds)
}


async function init() {
  const words = await loadCSV();  // Wait for data from loadCSV
  startScrollingClouds(words, 5);  // Start scrolling clouds after data arrives
}


// Initialize
init();