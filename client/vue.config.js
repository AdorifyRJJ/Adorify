const path = require("path");
const prefixer = require("postcss-prefix-selector");

module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:3000/",
        changeOrigin: true,
        ws: false,
      },
    },
  },
  configureWebpack: {
    resolve: {
      extensions: [".ts", ".vue"],
      alias: {
        "@": path.resolve("."),
      },
    },
  },
};
