const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    fallback: {
      constants: false,
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      os: require.resolve("os-browserify/browser"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      electron: false,
      buffer: require.resolve("buffer/"),
      "crypto-browserify": false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg)$/,
        use: ["file-loader"],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new webpack.DefinePlugin({
      process: { env: {} },
      DEPLOYED_ADDRESS: JSON.stringify(
        fs.readFileSync("deployedAddress", "utf8").replace(/\n|\r/g, "")
      ),
      DEPLOYED_ABI:
        fs.existsSync("deployedABI") && fs.readFileSync("deployedABI", "utf8"),

      DEPLOYED_ADDRESS_TOKENSALES: JSON.stringify(
        fs
          .readFileSync("deployedAddress_TokenSales", "utf8")
          .replace(/\n|\r/g, "")
      ),
      DEPLOYED_ABI_TOKENSALES:
        fs.existsSync("deployedABI_TokenSales") &&
        fs.readFileSync("deployedABI_TokenSales", "utf8"),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/riverSunShore.jpg", to: "riverSunShore.jpg" }],
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  devServer: {
    liveReload: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    // contentBase: path.resolve(__dirname, "src"),
    compress: true,
  },
};
