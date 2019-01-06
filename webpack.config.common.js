const CopyWebpackPlugin = require("copy-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const MD_EXTENSION_ID = "dnclbikcihnpjohihfcmmldgkjnebgnj";

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content: "./src/content.js"
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
      },
      {
        test: /\.jsx$/,
        use: [
          {
            loader: "babel-loader",
            options: { presets: ["@babel/env"] }
          }
        ]
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
    new CopyWebpackPlugin([{ from: "static", to: "." }])
  ],
  devtool: process.env.NODE_ENV === "production" ? false : "cheap-module-source-map"
};
