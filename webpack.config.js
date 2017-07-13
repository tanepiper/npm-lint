const path = require('path');
const webpack = require('webpack');
var fs = require('fs');

const CleanWebpackPlugin = require('clean-webpack-plugin');

var nodeModules = {};
fs
  .readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  target: 'node',
  devtool: 'sourcemap',
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'index.js'
  },
  externals: nodeModules,
  plugins: [
    new CleanWebpackPlugin('./bin'),
    new webpack.ContextReplacementPlugin(
      /\.\/\.\.\/rules\//,
      `${__dirname}/rules/`
    ),
    new webpack.ContextReplacementPlugin(
      /\.\/\.\.\/scans\//,
      `${__dirname}/scans/`
    ),
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    }),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
      entryOnly: false
    })
  ],
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }]
  }
};
