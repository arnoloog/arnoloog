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

@@ -39,11 +40,11 @@
      }
    });

    // sorteer grid en full arrays op nummer
    // sorteer grid en full
    grid.sort((a, b) => extractNumber(a) - extractNumber(b));
    full.sort((a, b) => extractNumber(a) - extractNumber(b));

    // trigger automatisch op de juiste plek
    // trigger automatisch in grid invoegen
    if (trigger) {
      const triggerPos = extractNumber(trigger);
      grid.splice(triggerPos - 1, 0, trigger);
@@ -55,7 +56,18 @@
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
