const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";
const rollInfo = require("./rollinfo.json");

function cleanExt(f) {
  return f.replace(".webp.webp", ".webp").replace(".png", ".webp");
}

function extractNumber(str) {
  const m = str.match(/(\d+)(?=\D*$)/);
  return m ? parseInt(m[1], 10) : 99999;
}

function extractYear(rollName) {
  const m = rollName.match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : 0;
}

function extractRollNo(rollName) {
  const m = rollName.match(/roll(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

module.exports = () => {
  const rolls = [];
  const dirs = fs.readdirSync(BASE);

  dirs.forEach((rollName) => {
    const dirPath = path.join(BASE, rollName);
    if (!fs.statSync(dirPath).isDirectory()) return;

    const files = fs.readdirSync(dirPath);

    const gridItems = [];
    const fullItems = [];
    let triggerItem = null;

    files.forEach((file) => {
      if (file.startsWith(".")) return;

      const cleaned = cleanExt(file);
      const rel = `/photos/rolls/${rollName}/${cleaned}`;
      const n = extractNumber(cleaned);

      if (cleaned.includes("-full-")) {
        fullItems.push(rel);
      } else if (cleaned.includes("-trigger-")) {
        triggerItem = { src: rel, index: n, isTrigger: true };
      } else if (cleaned.includes("-grid-")) {
        gridItems.push({ src: rel, index: n, isTrigger: false });
      }
    });

    const combined = [...gridItems];
    if (triggerItem) combined.push(triggerItem);
    combined.sort((a, b) => a.index - b.index);

    const year = extractYear(rollName);
    const rollNo = extractRollNo(rollName);
    const info = rollInfo[rollName] || {};

    rolls.push({
      name: rollName,
      year,
      rollNo,

      location: info.location || "",
      film: info.film || "",
      camera: info.camera || "",

      grid: combined,
      full: fullItems.sort((a, b) => extractNumber(a) - extractNumber(b)),
      trigger: triggerItem ? triggerItem.src : null
    });
  });

  rolls.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.rollNo !== a.rollNo) return b.rollNo - a.rollNo;
    return a.name.localeCompare(b.name);
  });

  const rollsByName = {};
  const rollsList = [];
  for (const r of rolls) {
    rollsByName[r.name] = r;
    rollsList.push(r.name);
  }

  return {
    rolls,
    rollsByName,
    rollsList
  };
};
