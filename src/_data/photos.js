const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename
    .replace(".webp.webp", ".webp")
    .replace(".png", ".webp");
}

// Haal het LAATSTE nummer uit een bestandsnaam
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

    // Skip geen directories (.gitkeep etc.)
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs.readdirSync(dirPath);

    const gridImages = [];

    files.forEach((file) => {
      if (file.startsWith(".")) return; // Skip hidden files

      const cleaned = cleanExt(file);
      const relPath = `/photos/rolls/${rollName}/${cleaned}`;

      gridImages.push(relPath);
    });

    // ⬇️ **BELANGRIJKE FIX: sorteer ALLES op nummer, dus trigger-62 komt juist**
    gridImages.sort((a, b) => {
      return extractNumber(a) - extractNumber(b);
    });

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
