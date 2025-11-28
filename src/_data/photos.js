const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename.replace(".webp.webp", ".webp");
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
    let triggerImg = null;

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const f = cleanExt(file);

      const rel = `photos/rolls/${rollName}/${f}`;

      if (f.includes("grid-")) {
        gridImages.push(rel);
      } else if (f.includes("trigger-")) {
        triggerImg = rel;
      } else if (f.includes("full-")) {
        fullImages.push(rel);
      }
    });

    gridImages.sort((a, b) => extractNumber(a) - extractNumber(b));
    fullImages.sort((a, b) => extractNumber(a) - extractNumber(b));

    rolls[rollName] = {
      name: rollName,
      grid: gridImages,
      trigger: triggerImg,
      full: fullImages
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList
  };
};