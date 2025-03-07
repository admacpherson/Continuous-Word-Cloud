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

export { loadCSV };