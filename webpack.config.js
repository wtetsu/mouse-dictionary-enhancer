const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const DefinePlugin = require("webpack/lib/DefinePlugin");
const GenerateManifestPlugin = require("./build_tools/webpack_plugins/GenerateManifestPlugin");

const MD_EXTENSION_ID = "dnclbikcihnpjohihfcmmldgkjnebgnj";

const mode = process.env.NODE_ENV || "development";
const isProd = mode === "production";

const version = require("./package.json").version;

module.exports = (env) => {
  if (!env.edition) {
    throw new Error("env.edition is empty");
  }

  return {
    mode,
    entry: {
      content: "./src/content.ts",
      background: "./src/background.ts",
      documentStart: "./src/documentStart.ts",
    },
    output: {
      path: `${__dirname}/dist-${env.edition}`,
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
          { from: `static-${env.edition}`, to: "." },
        ],
      }),
      new GenerateManifestPlugin({
        from: `edition/manifest-${env.edition}.json`,
        to: "manifest.json",
        overwrite: { version },
        debug: !isProd,
      }),
    ],
    devtool: process.env.NODE_ENV === "production" ? false : "cheap-module-source-map",
  };
};
