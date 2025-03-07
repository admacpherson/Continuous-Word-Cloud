async function init() {
  const words = await loadCSV();  // Waits for data
  startScrollingClouds(words, 5);  // Start scrolling clouds after data arrives
}

// Async function to load CSV then call word cloud instantiation
async function loadCSV() {
  // Try/catch for file handling
  try {
    const response = await fetch("/Readership Reports/Word List.csv"); // Fetch list of words
    
    if (!response.ok) throw new Error("Failed to load CSV"); // Throw error

    const text = await response.text(); // Convert file to plain text
    
    const words = text.split(/\r?\n/) // Split CSV into lines (cross-platform)
      .map(row => {
        // Regex to split only commas **outside** quotes (allows for City, Country)
        const matches = row.match(/(?:[^",]+|"[^"]*")+/g);
        // Split row into word and category by comma
        const word = matches ? matches[0].trim().replace(/['"]+/g, '') : ''; // First column (Word)
        const category = matches && matches[1] ? matches[1].trim().replace(/['"]+/g, '') : ''; // Second column (Category)

        // Return only valid rows
        return word ? { text: word, category: category } : null;
      })
      .filter(item => item.text); // Remove empty entries


    console.log("CSV Loaded:", words); // Confirm words and categories were loaded
    return words;
    
  } catch (err) {
    console.error("Error loading CSV:", err); // Handle errors
    return ["Error"]; //Return a self-explanatory array to prevent runtime error
  }
}
  
  
// Function to map categories to colors
function getColor(category) {
  const colors = {
    "North America": "#008631",   // Dark green
    "Latin America": "#1FD655",   // Light green
    "Europe": "#004494",          // Blue
    "Asia": "#D2042D",            // Red
    "Africa": "#F8AE21",          // Orange
    "AUNZ": "##CC33FF",           // Purple
    "Middle East": "#FFCCCC"      // Light pink
  };
  return colors[category] || "#000000"; // Default to black if category is not found
}

  
// Wrapper function to create formatted word cloud using D3
// Based on code from https://d3-graph-gallery.com/graph/wordcloud_basic.html
function createWordCloud(words) {

  // Set margins and dimensions
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 450 - margin.left - margin.right,
      height = 450 - margin.top - margin.bottom;
  
  // Create a new div container for the word cloud (cloud-container)
  const cloudContainer = document.createElement('div');
  cloudContainer.className = 'cloud-container';  // Add the animation class for scrolling
  document.getElementById('wordcloud').appendChild(cloudContainer);  // Append the container to the page


  // Create SVG object and append to page body
  var svg = d3.select(cloudContainer).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // Constructs a new cloud layout instance. Runs an algorithm to find the position of words that suits your requirements
  var layout = d3.layout.cloud()
    .size([width, height])
    .words(words.map(d => ({ text: d.text, category: d.category })))
    .padding(5)
    //Randomize font size using min/max parameters
    .fontSize(function(){
      const min = 10
      const max = 30
      return Math.floor(Math.random() * (max - min + 1)) + min;
    })
    //Rotate words at a random allowed angle
    .rotate(function() { 
      const angles = [0, 0, 90, -90];  // Possible angles
      return angles[Math.floor(Math.random() * angles.length)];  // Randomly select one angle
    })
    .on("end", draw);
  layout.start();
  
  // Draws the words based on the layout
  function draw(words) {
    svg.append("g")
      .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", d => `${d.size}px`)
      .style("fill", d => getColor(d.category)) // Color based on category
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(d => d.text);
  }
}

function startScrollingClouds(words, speed) {
  setInterval(() => {
    createWordCloud(words);  // Generate a new word cloud every interval
  }, speed * 1000); // Speed in seconds (time between new word clouds)
}


//Initialize
init()