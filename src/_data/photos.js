const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function cleanExt(filename) {
  return filename.replace(".webp.webp", ".webp");
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
    const files = fs.readdirSync(dirPath);

    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach((file) => {
      const fixed = cleanExt(file);

      if (fixed.includes("-full-")) {
        full.push(`/photos/rolls/${rollName}/${fixed}`);
      } else if (fixed.includes("-grid-")) {
        grid.push(`/photos/rolls/${rollName}/${fixed}`);
      } else if (fixed.includes("trigger")) {
        trigger = `/photos/rolls/${rollName}/${fixed}`;
      }
    });

    // sorteer grid & full
    grid.sort((a, b) => extractNumber(a) - extractNumber(b));
    full.sort((a, b) => extractNumber(a) - extractNumber(b));

    // trigger invoegen op juiste plek
    if (trigger) {
      const pos = extractNumber(trigger); // bv roll01-trigger-62.webp
      const index = pos - 1;

      if (index >= 0 && index <= grid.length) {
        grid.splice(index, 0, trigger);
      }
    }

    rolls[rollName] = { grid, full, trigger };
    rollsList.push(rollName);
  });

  rollsList.sort();

  return { rolls, rollsList };
};
