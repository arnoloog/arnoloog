const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Passthrough files
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/photos");

  // Layout alias (jouw base.njk!)
  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");

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
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
