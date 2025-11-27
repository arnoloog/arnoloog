const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

// verwijdert dubbele extensies zoals .webp.webp
function cleanExt(filename) {
  return filename.replace(".webp.webp", ".webp");
}

// haalt nummer uit een bestandsnaam (bijv. 01, 02, 12)
function extractNumber(str) {
  const num = str.match(/(\d+)/);
  return num ? parseInt(num[1], 10) : 99999;
}

module.exports = () => {
  const rolls = {};
  const rollsList = [];

  // lees alle roll folders
  const rollDirs = fs.readdirSync(BASE);

  rollDirs.forEach((rollName) => {
    const dirPath = path.join(BASE, rollName);
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs.readdirSync(dirPath).map(cleanExt);

    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach((file) => {
      // *** BELANGRIJK: correct pad (GEEN /arnoloog meer!) ***
      const filePath = `/photos/rolls/${rollName}/${file}`;

      if (file.includes("grid")) {
        grid.push(filePath);
      } else if (file.includes("full")) {
        full.push(filePath);
      } else if (file.includes("trigger")) {
        trigger = filePath;
      }
    });

    // sorteer afbeeldingen op nummer
    grid.sort((a, b) => extractNumber(a) - extractNumber(b));
    full.sort((a, b) => extractNumber(a) - extractNumber(b));

    // trigger automatisch invoegen op juiste plaats
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
    rollsList
  };
};