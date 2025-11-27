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

const files = fs.readdirSync(dirPath).map(cleanExt);  

const grid = [];  
const full = [];  
let trigger = null;  

files.forEach((file) => {  
  const filePath = `/arnoloog/photos/rolls/${rollName}/${file}`;  

  if (file.includes("grid")) {  
    grid.push(filePath);  
  } else if (file.includes("full")) {  
    full.push(filePath);  
  } else if (file.includes("trigger")) {  
    trigger = filePath;  
  }  
});  

// sorteer grid en full  
grid.sort((a, b) => extractNumber(a) - extractNumber(b));  
full.sort((a, b) => extractNumber(a) - extractNumber(b));  

// trigger automatisch in grid invoegen  
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

// sorteert roll folders logisch (2017/2018/…)
rollsList.sort();

return {
rolls,
rollsList
};
};

return { rolls };
};