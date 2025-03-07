let cloudContainers = [];  // Store references to each word cloud container

// Function to check and remove word clouds that are off-screen
function cleanupOffscreenClouds() {
  const containerWidth = document.getElementById('wordcloud').offsetWidth;

  cloudContainers.forEach(cloudContainer => {
    const cloudWidth = cloudContainer.offsetWidth;
    const cloudPosition = cloudContainer.offsetLeft;

    // If the cloud is completely off the screen, remove it
    if (cloudPosition + cloudWidth < 0 || cloudPosition > containerWidth) {
      cloudContainer.remove();  // Remove the word cloud if it's off-screen
      cloudContainers = cloudContainers.filter(c => c !== cloudContainer);  // Remove from tracking array
    }
  });
}

export { cloudContainers, cleanupOffscreenClouds };