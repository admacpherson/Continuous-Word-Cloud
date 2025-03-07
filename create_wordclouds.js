import { getColor } from './get_color.js';
import { cloudContainers } from './cleanup_clouds.js';


let xOffset = 0;  // Track horizontal offset (x-axis)
const gapBetweenClouds = 500;  // Gap between clouds
const maxClouds = 5;  // Limit the number of visible clouds at a time


// Wrapper function to create formatted word cloud using D3
// Based on code from https://d3-graph-gallery.com/graph/wordcloud_basic.html
function createWordCloud(words) {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const containerWidth = document.getElementById('wordcloud').offsetWidth;  // Get container width here
  const width = 450 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'cloud-container';
  document.getElementById('wordcloud').appendChild(cloudContainer);

  const svg = d3.select(cloudContainer).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(d => ({ text: d.text, category: d.category })))
    .padding(5)
    .fontSize(function() {
      const min = 10;
      const max = 30;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    })
    .rotate(function() {
      const angles = [0, 0, 90, -90];
      return angles[Math.floor(Math.random() * angles.length)];
    })
    .on("end", function(words) {
      draw(words, xOffset); // Pass the current xOffset value to the draw function
    });
  layout.start();

  // Ensure xOffset doesn't exceed container width and prevent overlap
  let currentXOffset = xOffset;
  if (currentXOffset + width + gapBetweenClouds <= containerWidth) {
    xOffset = currentXOffset + width + gapBetweenClouds;  // Move xOffset for the next cloud
  } else {
    xOffset = 0;  // Reset to 0 if there is no space for the next cloud
  }


  // Drawing the words inside the cloud
  function draw(words, currentXOffset) {
    svg.append("g")
      .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("fill", d => getColor(d.category)) // Color based on category
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x + currentXOffset, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(d => d.text);
  }

  cloudContainers.push(cloudContainer);  // Add the new cloud container to the tracking array

  // If there are more word clouds than the max, remove the first one (oldest)
  if (cloudContainers.length > maxClouds) {
    const oldestCloud = cloudContainers.shift();
    oldestCloud.remove();
  }
}

export { xOffset, gapBetweenClouds, maxClouds, createWordCloud }