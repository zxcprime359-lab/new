const fs = require("fs");
const path = require("path");

// Path to your SW file
const swFile = path.join(__dirname, "public", "sw.js");
let swContent = fs.readFileSync(swFile, "utf8");

// Read the Next.js build ID
const buildIdFile = path.join(__dirname, ".next", "BUILD_ID");
const buildId = fs.readFileSync(buildIdFile, "utf8").trim();

// Replace placeholder
swContent = swContent.replace("__BUILD_ID__", buildId);

// Write back
fs.writeFileSync(swFile, swContent, "utf8");

console.log(`sw.js updated with build ID: ${buildId}`);
