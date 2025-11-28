const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename.replace(".webp.webp", ".webp").replace(".png", ".webp");
}

function extractNumber(str) {
  const num = str.match(/(\d+)/);
  return num ? parseInt(num[1], 10) : 99999;
}

module.exports = () => {
  const rolls = {};
  const rollsList = [];

  const rollDirs = fs.readdirSync(BASE).filter(item => {
    const fullPath = path.join(BASE, item);
    return fs.statSync(fullPath).isDirectory();  // <-- skip files!
  });

  rollDirs.forEach((rollName) => {
    const dirPath = path.join(BASE, rollName);
    const files = fs.readdirSync(dirPath);

    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach((file) => {
      const cleaned = cleanExt(file);

      if (cleaned.includes("-grid-")) grid.push(cleaned);
      else if (cleaned.includes("-full-")) full.push(cleaned);
      else if (cleaned.includes("trigger")) trigger = cleaned;
    });

    grid.sort((a, b) => extractNumber(a) - extractNumber(b));
    full.sort((a, b) => extractNumber(a) - extractNumber(b));

    if (trigger) {
      const triggerPos = extractNumber(trigger);
      grid.splice(triggerPos - 1, 0, trigger);
    }

    rolls[rollName] = {
      name: rollName,
      grid,
      full,
      trigger,
    };

    rollsList.push(rollName);
  });

  rollsList.sort();

  return {
    rolls,
    rollsList,
  };
};
