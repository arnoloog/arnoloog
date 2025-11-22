const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Passthrough files
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/photos");

  // Nunjucks date filter
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    try {
      return DateTime.fromJSDate(value).toFormat(format);
    } catch (e) {
      console.error("Date filter error:", e);
      return value;
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",      // laat dit zo
      layouts: "_includes/layouts", // voeg deze toe (!!)
      data: "_data",
      output: "_site"
    }
  };
};
