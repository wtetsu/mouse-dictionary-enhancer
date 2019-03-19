const CopyWebpackPlugin = require("copy-webpack-plugin");
const commonConfig = require("./webpack.config.common.js");

const specificConfig = Object.assign({}, commonConfig);

specificConfig.output = {
  path: __dirname + "/dist-all"
};

specificConfig.plugins.push(new CopyWebpackPlugin([{ from: "static-allurls", to: "." }]));

module.exports = specificConfig;
