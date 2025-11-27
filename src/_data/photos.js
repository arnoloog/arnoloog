const fs = require("fs");
const path = require("path");

module.exports = () => {
  const rollsDir = "src/photos/rolls";
  const rollsFolders = fs.readdirSync(rollsDir).filter(f => !f.startsWith("."));
  
  const data = {
    rollsList: [],
    rolls: {}
  };

  rollsFolders.forEach(folder => {
    const folderPath = path.join(rollsDir, folder);
    const files = fs.readdirSync(folderPath);

    const grid = [];
    const full = [];
    let trigger = null;

    files.forEach(file => {
      const filePath = `/photos/rolls/${folder}/${file}`;

      if (file.toLowerCase().includes("grid")) {
        grid.push(filePath);
      } 
      else if (file.toLowerCase().includes("trigger")) {
        trigger = filePath;
      } 
      else if (file.toLowerCase().includes("full")) {
        full.push(filePath);
      }
    });

    // Sorteren voor perfecte volgorde
    grid.sort();
    full.sort();

    data.rollsList.push(folder);
    data.rolls[folder] = {
      grid,
      trigger,
      full
    };
  });

  // Sorteer roll-mappen (oud → nieuw)
  data.rollsList.sort();

  return data;
};
