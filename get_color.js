// Function to map categories to colors
function getColor(category) {
  const colors = {
    "North America": "#008631",   // Dark green
    "Latin America": "#1FD655",   // Light green
    "Europe": "#004494",          // Blue
    "Asia": "#D2042D",            // Red
    "Africa": "#F8AE21",          // Orange
    "AUNZ": "#CC33FF",           // Purple
    "Middle East": "#FFCCCC"      // Light pink
  };
  return colors[category] || "#000000"; // Default to black if category is not found
}


//Export
export { getColor };