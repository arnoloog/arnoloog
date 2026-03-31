const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // CSS en foto's doorgeven naar _site
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/photos");

  // Globale datum "now"
  eleventyConfig.addGlobalData("now", () => new Date());

  // Datumfilter
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    try {
      if (value instanceof Date) {
        return DateTime.fromJSDate(value).toFormat(format);
      }

      if (typeof value === "string") {
        const parsed = DateTime.fromISO(value);
        if (parsed.isValid) return parsed.toFormat(format);
      }

      return value;
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
