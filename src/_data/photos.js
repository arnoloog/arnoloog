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

  const rollDirs = fs.readdirSync(BASE);

  rollDirs.forEach((rollName) => {
    const dirPath = path.join(BASE, rollName);
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs.readdirSync(dirPath);

    let grid = [];
    let full = [];
    let trigger = null;

    files.forEach((file) => {
      const clean = cleanExt(file);

      if (clean.includes("grid")) grid.push(clean);
      else if (clean.includes("full")) full.push(clean);
      else if (clean.includes("trigger")) trigger = clean;
    });

    grid.sort((a, b) => extractNumber(a) - extractNumber(b));
    full.sort((a, b) => extractNumber(a) - extractNumber(b));

    if (trigger) {
      const pos = extractNumber(trigger);
      grid.splice(pos - 1, 0, trigger);
    }

    rolls[rollName] = {
      rollName,
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
