const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename.replace(".webp.webp", ".webp").replace(".png", ".webp");
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
    let triggerImage = null;

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const cleaned = cleanExt(file);
      const relPath = `photos/rolls/${rollName}/${cleaned}`;

      if (cleaned.includes("trigger")) {
        triggerImage = relPath;
      } else if (cleaned.includes("grid")) {
        gridImages.push(relPath);
      }
    });

    gridImages.sort((a, b) => extractNumber(a) - extractNumber(b));

    rolls[rollName] = {
      name: rollName,
      trigger: triggerImage,
      grid: gridImages
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList
  };
};