const CopyWebpackPlugin = require("copy-webpack-plugin");
const commonConfig = require("./webpack.config.common.js");

const specificConfig = Object.assign({}, commonConfig);

specificConfig.output = {
  path: __dirname + "/dist-enhancer",
};

specificConfig.plugins.push(
  new CopyWebpackPlugin({
    patterns: [{ from: "static-enhancer", to: "." }],
  })
);

module.exports = specificConfig;
