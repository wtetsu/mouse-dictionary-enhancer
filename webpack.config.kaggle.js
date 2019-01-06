const CopyWebpackPlugin = require("copy-webpack-plugin");
const commonConfig = require("./webpack.config.common.js");

const specificConfig = Object.assign({}, commonConfig);

specificConfig.output = {
  path: __dirname + "/dist-kaggle"
};

specificConfig.plugins.push(new CopyWebpackPlugin([{ from: "static", to: "." }]));

module.exports = specificConfig;
