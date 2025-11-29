const fs = require("fs");
const path = require("path");

const ROLLS_BASE = "src/photos/rolls";

// pak laatste nummer uit de bestandsnaam (01, 12, 62, …)
function extractNumber(str) {
  const match = str.match(/(\d+)(?=\D*$)/);
  return match ? parseInt(match[1], 10) : 99999;
}

module.exports = () => {
  const rolls = {};
  const rollsList = [];

  // directories in src/photos/rolls (bv. 2017-roll01, 2018-roll02, ...)
  const rollDirs = fs
    .readdirSync(ROLLS_BASE)
    .filter((name) => !name.startsWith("."))
    .sort(); // oplopend: 2017-roll01, 2018-roll02, ...

  rollDirs.forEach((rollName) => {
    const dirPath = path.join(ROLLS_BASE, rollName);
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs
      .readdirSync(dirPath)
      .filter((file) => !file.startsWith("."));

    const gridItems = [];
    const fullImages = [];

    files.forEach((file) => {
      const webPath = `photos/rolls/${rollName}/${file}`;

      // full-foto’s: alleen voor de roll-pagina
      if (file.includes("-full-")) {
        fullImages.push(webPath);
      }

      // grid-foto’s EN trigger-foto’s komen in de grid
      if (file.includes("-grid-") || file.includes("-trigger-")) {
        gridItems.push({
          src: webPath,
          num: extractNumber(file),
          isTrigger: file.includes("-trigger-"),
        });
      }
    });

    // sorteer alles op nummer
    gridItems.sort((a, b) => a.num - b.num);
    fullImages.sort((a, b) => extractNumber(a) - extractNumber(b));

    rolls[rollName] = {
      name: rollName,
      grid: gridItems, // objects: { src, num, isTrigger }
      full: fullImages, // strings
    };

    rollsList.push(rollName);
  });

  return {
    rolls,
    rollsList,
  };
};
