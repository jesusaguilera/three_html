const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  module: {
    rules: [
      // ES6
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      // Html
      {
        test: /\.html$/i,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      // SASS
      {
        test: /\.scss/i,
        use: [
          {
            loader: MiniCSSExtractPlugin.loader,
            options: {
              publicPath: "./",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      // IMAGES
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./images",
            },
          },
          "image-webpack-loader",
        ],
      },
      // FONT
      {
        test: /\.(ttf|otf|woff)$/i,
        use: {
          loader: "file-loader",
          options: {
            // publicPath relative to scss
            publicPath: "../fonts",
            outputPath: "./fonts",
          },
        },
      },
      // GLSL
      {
        test: /\.(glsl|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          "raw-loader",
          "glslify-loader",
        ]
      }
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      // chunks: ["js"],
      // hash: true
    }),
    new MiniCSSExtractPlugin({
      filename: "./css/main.css",
    }),
  ],
};
