const fs = require("fs");
const path = require("path");

module.exports = function () {
  const rollsDir = path.join(__dirname, "..", "photos", "rolls");
  const rolls = {};

  // Lees alle roll-mappen
  fs.readdirSync(rollsDir).forEach((rollFolder) => {
    const folderPath = path.join(rollsDir, rollFolder);

    if (!fs.lstatSync(folderPath).isDirectory()) return;

    // Alle bestanden in map lezen
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach((file) => {
      const lower = file.toLowerCase();

      if (lower.includes("trigger")) {
        trigger = `/photos/rolls/${rollFolder}/${file}`;
      } else if (lower.includes("grid")) {
        grid.push(`/photos/rolls/${rollFolder}/${file}`);
      } else if (lower.includes("full")) {
        full.push(`/photos/rolls/${rollFolder}/${file}`);
      }
    });

    rolls[rollFolder] = {
      slug: rollFolder,
      grid,
      trigger,
      full,
    };
  });

  return {
    rolls,
    rollsList: Object.keys(rolls).sort(),
  };
};
