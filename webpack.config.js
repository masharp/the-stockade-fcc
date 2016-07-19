'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  debug: true,
  entry: {
    global: './scripts/global.js'
  },
  output: {
    path: path.join(__dirname, './public/javascripts'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ]
};
