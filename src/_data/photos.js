const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

function extractNum(str) {
  const match = str.match(/(\d+)(?!.*\d)/);
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

    files.forEach((file) => {
      if (!file.endsWith(".webp")) return;

      const rel = `/photos/rolls/${rollName}/${file}`;

      if (file.includes("grid")) grid.push(rel);
      if (file.includes("full")) full.push(rel);
    });

    grid.sort((a, b) => extractNum(a) - extractNum(b));
    full.sort((a, b) => extractNum(a) - extractNum(b));

    rolls[rollName] = {
      name: rollName,
      grid,
      full
    };

    rollsList.unshift(rollName);
  });

  return {
    rolls,
    rollsList
  };
};
