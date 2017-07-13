const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  name: 'npm-lint',
  entry: ['babel-polyfill', './src/index.ts'],
  target: 'node',
  devtool: 'sourcemap',
  output: {
    path: path.join(__dirname, 'bin'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  externals: [nodeExternals()],
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
      loader: 'babel-loader',
      options: {
					cacheDirectory: true
				}
    }, {
      test: /\.ts?$/,
      exclude: /(node_modules)/,
      loader: 'ts-loader',
      options: {
					cacheDirectory: true
				}
    }]
  }
};
