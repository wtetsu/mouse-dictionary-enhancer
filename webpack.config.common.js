const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    content: "./src/content.js"
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
  plugins: [new CopyWebpackPlugin([{ from: "static", to: "." }])],
  devtool: process.env.NODE_ENV === "production" ? false : "cheap-module-source-map"
};
