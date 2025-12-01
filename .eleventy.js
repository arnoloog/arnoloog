const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // CSS en foto’s doorgeven naar _site
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/photos");

  // Datumfilter (als je ooit nodig hebt)
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
 
