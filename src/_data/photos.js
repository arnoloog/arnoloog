const fs = require("fs");
const path = require("path");

const BASE = "src/photos/rolls";

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

    // combineer grid + trigger, sorteer op nummer
    const combined = [...gridItems];
    if (triggerItem) combined.push(triggerItem);
    combined.sort((a, b) => a.index - b.index);

    const year = extractYear(rollName);
    const rollNo = extractRollNo(rollName);

    rolls.push({
      name: rollName,
      year,
      rollNo,
      grid: combined,
      full: fullItems.sort((a, b) => extractNumber(a) - extractNumber(b)),
      trigger: triggerItem ? triggerItem.src : null
    });
  });

  // sorteer rolls: nieuwste jaar bovenaan, dan hoogste rollnr
  rolls.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.rollNo !== a.rollNo) return b.rollNo - a.rollNo;
    return a.name.localeCompare(b.name);
  });

  // map per naam (handig, mocht je later nodig hebben)
  const rollsByName = {};
  const rollsList = [];
  for (const r of rolls) {
    rollsByName[r.name] = r;
    rollsList.push(r.name);
  }

  return {
    rolls,       // array
    rollsByName, // map
    rollsList    // namen in volgorde
  };
};
