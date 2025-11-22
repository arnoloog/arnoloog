const fs = require("fs");
const path = require("path");

function getImagesFromDir(relativeDir) {
  const inputDir = path.join(__dirname, "..", "photos", relativeDir);
  if (!fs.existsSync(inputDir)) return [];
  return fs.readdirSync(inputDir)
    .filter(file => file.match(/\.(jpe?g|png|webp|gif)$/i))
    .sort()
    .map(file => ({
      src: `/photos/${relativeDir}/${file}`,
      filename: file
    }));
}

module.exports = function() {
  const homepage = getImagesFromDir("homepage");

  const rollsRoot = path.join(__dirname, "..", "photos", "rolls");
  let rolls = [];
  if (fs.existsSync(rollsRoot)) {
    const entries = fs.readdirSync(rollsRoot, { withFileTypes: true });
    rolls = entries
      .filter(entry => entry.isDirectory())
      .map(dir => {
        const slug = dir.name;
        const photos = getImagesFromDir(path.join("rolls", slug));
        return { slug, photos };
      });
  }

  return {
    homepage,
    rolls
  };
};