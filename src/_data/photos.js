const fs = require("fs");
const path = require("path");

module.exports = function () {
  const rollsDir = path.join(__dirname, "..", "photos", "rolls");
  const rolls = {};

  // read all roll folders
  fs.readdirSync(rollsDir).forEach((rollFolder) => {
    const folderPath = path.join(rollsDir, rollFolder);
    if (!fs.lstatSync(folderPath).isDirectory()) return;

    // get images inside roll
    const images = fs
      .readdirSync(folderPath)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort(); // ensures 01,02,03 order

    rolls[rollFolder] = images.map((img) => ({
      src: `/photos/rolls/${rollFolder}/${img}`,
      filename: img,
    }));
  });

  return {
    rolls,
    rollsList: Object.keys(rolls).sort(),
  };
};
