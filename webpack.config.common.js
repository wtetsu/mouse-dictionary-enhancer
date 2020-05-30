const CopyWebpackPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const MD_EXTENSION_ID = "dnclbikcihnpjohihfcmmldgkjnebgnj";

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content: "./src/content.js",
    background: "./src/background.js"
  },
  output: {
    path: __dirname + "/dist"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    new DefinePlugin({
      MD_EXTENSION_ID: JSON.stringify(MD_EXTENSION_ID)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "static", to: "." },
        { from: __dirname + "/node_modules/milligram/dist/milligram.min.css", to: "options/" }
      ]
    })
  ],
  devtool: process.env.NODE_ENV === "production" ? false : "cheap-module-source-map"
};
