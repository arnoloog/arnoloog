const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // Styles kopiëren naar /styles.css
  eleventyConfig.addPassthroughCopy({
    "src/styles.css": "styles.css"
  });

  // FOTO’S JUIST KOPIËREN → naar /photos/
  eleventyConfig.addPassthroughCopy({
    "src/photos": "photos"
  });

  // Date filter
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    try {
      return DateTime.fromJSDate(value).toFormat(format);
    } catch (e) {
      return value;
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};