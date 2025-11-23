const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {

  // Static files doorgeven
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/photos");

  // Slimme Nunjucks date filter
  eleventyConfig.addNunjucksFilter("date", (value, format = "yyyy-MM-dd") => {
    try {
      let dt;

      // "now" → huidige tijd
      if (!value || value === "now") {
        dt = DateTime.now();
      }
      // Echte JS Date
      else if (value instanceof Date) {
        dt = DateTime.fromJSDate(value);
      }
      // String → proberen als ISO
      else if (typeof value === "string") {
        dt = DateTime.fromISO(value);
        if (!dt.isValid) {
          // fallback: toch gewoon nu pakken
          dt = DateTime.now();
        }
      } else {
        // onbekend type → gewoon teruggeven
        return value;
      }

      return dt.toFormat(format);
    } catch (e) {
      console.error("Date filter error:", e);
      return value;
    }
  });

  return {
    pathPrefix: "/",   // laten zoals je het nu hebt

    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
