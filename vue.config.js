const path = require("path");
module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    Object.assign(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
          "@helper": path.resolve(__dirname, "./src/helper"),
          "@views": path.resolve(__dirname, "./src/views"),
          "@assets": path.resolve(__dirname, "./src/assets")
        }
      }
    });
  }
};
