const words = {
  africa: [["safari", 10], ["savanna", 8], ["Nile", 6]],
  asia: [["silk", 9], ["dynasty", 7], ["Himalaya", 6]],
  australia: [["kangaroo", 10], ["reef", 8], ["outback", 7]],
  caribbean: [["island", 9], ["beach", 8], ["reggae", 7]],
  centralAmerica: [["Maya", 9], ["canal", 7], ["jungle", 6]],
  europe: [["renaissance", 10], ["castle", 8], ["EU", 6]],
  middleEast: [["desert", 9], ["oil", 8], ["oasis", 7]],
  northAmerica: [["freedom", 10], ["Hollywood", 8], ["jazz", 7]],
  southAmerica: [["Amazon", 10], ["Andes", 8], ["carnival", 7]]
};

const colors = {
  africa: "#ffcc66",
  asia: "#ff9999",
  australia: "#99ccff",
  caribbean: "#66ffcc",
  centralAmerica: "#cc99ff",
  europe: "#cccccc",
  middleEast: "#ff9966",
  northAmerica: "#99ff99",
  southAmerica: "#ffccff"
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("map-container");
  const svg = container.querySelector("svg");
  const defs = svg.querySelector("defs");

  Object.keys(words).forEach(continentId => {
    const paths = svg.querySelectorAll(`path#${continentId}`);
    if (!paths.length) return;

    // Filter out tiny paths to avoid offset issues
    const validPaths = Array.from(paths).filter(p => {
      const b = p.getBBox();
      return b.width * b.height > 50; // ignore tiny islands
    });
    if (!validPaths.length) return;

    // Compute merged bounding box
    let bbox = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
    validPaths.forEach(path => {
      const b = path.getBBox();
      bbox.x = Math.min(bbox.x, b.x);
      bbox.y = Math.min(bbox.y, b.y);
      bbox.x2 = Math.max(bbox.x2, b.x + b.width);
      bbox.y2 = Math.max(bbox.y2, b.y + b.height);
      path.setAttribute("fill", colors[continentId]);
    });
    const width = bbox.x2 - bbox.x;
    const height = bbox.y2 - bbox.y;

    // Create a <clipPath> for the continent
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", `clip-${continentId}`);
    validPaths.forEach(path => clipPath.appendChild(path.cloneNode(true)));
    defs.appendChild(clipPath);

    // Create a group for the word cloud, clipped to the continent
    const cloudGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    cloudGroup.setAttribute("clip-path", `url(#clip-${continentId})`);
    svg.appendChild(cloudGroup);

    // Automatically scale word sizes based on continent area
    const area = width * height;
    const weightFactor = Math.sqrt(area) / 20;

    // Create the word cloud
    const layout = d3.layout.cloud()
      .size([width, height])
      .words(words[continentId].map(d => ({ text: d[0], size: d[1] * 10 })))
      .padding(2)
      .rotate(0)
      .fontSize(d => d.size * weightFactor / 50) // scale to continent
      .on("end", cloudWords => {
        d3.select(cloudGroup)
          .selectAll("text")
          .data(cloudWords)
          .enter()
          .append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", d => d.size + "px")
          .attr("fill", "#111")
          .attr("font-family", "sans-serif")
          .attr("transform", d => `translate(${bbox.x + width/2 + d.x},${bbox.y + height/2 + d.y}) rotate(${d.rotate})`)
          .text(d => d.text);
      });

    layout.start();
  });
});
