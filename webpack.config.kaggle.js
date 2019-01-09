const CopyWebpackPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const commonConfig = require("./webpack.config.common.js");

const specificConfig = Object.assign({}, commonConfig);

specificConfig.output = {
  path: __dirname + "/dist-kaggle"
};

specificConfig.plugins.push(
  new DefinePlugin({
    TARGET_SITE_PATTERN: JSON.stringify("https://www.kaggle.com/*")
  })
);

specificConfig.plugins.push(new CopyWebpackPlugin([{ from: "static-kaggle", to: "." }]));

module.exports = specificConfig;
