var path = require('path');
var merge = require('webpack-merge');

var jsConfig = require('./webpack.js.config');
var cssConfig = require('./webpack.css.config');

module.exports = merge.smart(
  cssConfig,
  jsConfig
);
