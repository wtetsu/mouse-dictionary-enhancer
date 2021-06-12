const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");

const MD_EXTENSION_ID = "dnclbikcihnpjohihfcmmldgkjnebgnj";

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

module.exports = {
  mode,
  entry: {
    content: "./src/content.ts",
    background: "./src/background.ts",
  },
  output: {
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
    alias: {
      ponyfill$: path.resolve(__dirname, "src/lib/ponyfill/chrome"),
    },
  },
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ["console.info", "console.warn", "console.time", "console.timeEnd"],
          },
        },
      }),
    ],
  },
  plugins: [
    new DefinePlugin({
      MD_EXTENSION_ID: JSON.stringify(MD_EXTENSION_ID),
    }),
    new CopyPlugin({
      patterns: [
        { from: "static", to: "." },
        { from: __dirname + "/node_modules/milligram/dist/milligram.min.css", to: "options/" },
      ],
    }),
  ],
  devtool: process.env.NODE_ENV === "production" ? false : "cheap-module-source-map",
};
