const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename
    .replace(".webp.webp", ".webp")
    .replace(".png", ".webp");
}

function extractNumber(str) {
  const match = str.match(/(\d+)(?=\D*$)/);
  return match ? parseInt(match[1], 10) : 99999;
}

module.exports = () => {
  const rolls = {};
  const rollsList = [];

  const rollDirs = fs.readdirSync(BASE);

  rollDirs.forEach((rollName) => {
    const dirPath = path.join(BASE, rollName);
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs.readdirSync(dirPath);

    const gridImages = [];

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const cleaned = cleanExt(file);

      // Return ONLY the filename
      gridImages.push(cleaned);
    });

    // Sort images numerically
    gridImages.sort((a, b) => extractNumber(a) - extractNumber(b));

    rolls[rollName] = {
      name: rollName,
      grid: gridImages
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList
  };
};