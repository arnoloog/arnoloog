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
    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const cleaned = cleanExt(file);
      const relPath = `/photos/rolls/${rollName}/${cleaned}`;

      if (cleaned.includes("grid")) grid.push({ file: relPath, order: extractNumber(cleaned) });
      if (cleaned.includes("full")) full.push({ file: relPath, order: extractNumber(cleaned) });
      if (cleaned.includes("trigger")) trigger = { file: relPath, order: extractNumber(cleaned) };
    });

    grid.sort((a, b) => a.order - b.order);
    full.sort((a, b) => a.order - b.order);

    rolls[rollName] = {
      name: rollName,
      grid: grid.map(g => g.file),
      full: full.map(f => f.file),
      trigger: trigger ? trigger.file : null
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList
  };
};
