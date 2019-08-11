require('dotenv').config();
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');

const extractCSS = true;

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'index': './src/front-end/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'www'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [extractCSS ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [extractCSS ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
      {
        test: /\.html$/,
        use: ['raw-loader']
      },
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Gate 74',
      myPageHeader: 'Gate 74',
      template: './src/front-end/index.html',
      filename: './index.html'
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new BundleAnalyzerPlugin(),
  ]
};
