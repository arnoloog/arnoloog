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
    const fullImages = [];

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const cleaned = cleanExt(file);

      // GRID -> roll01-grid-xx.webp
      if (cleaned.includes("-grid-")) {
        gridImages.push(cleaned);
      }

      // FULL -> roll01-full-xx.webp
      if (cleaned.includes("-full-")) {
        fullImages.push(cleaned);
      }
    });

    gridImages.sort((a, b) => extractNumber(a) - extractNumber(b));
    fullImages.sort((a, b) => extractNumber(a) - extractNumber(b));

    rolls[rollName] = {
      name: rollName,
      grid: gridImages,
      full: fullImages
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList
  };
};