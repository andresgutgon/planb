var path = require('path');
var merge = require('webpack-merge');

var jsConfig = require('./webpack.js.config');
var cssConfig = require('./webpack.css.config');

// TODO: implement production build
const DEV = true;

const config = {
  context: `${__dirname}/src`,
  target: 'web',
  devtool: 'eval',
  performance: { hints: false },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: DEV ? '[name].bundle.js' : '[name].[chunkhash].js',
    chunkFilename: DEV ? '[name].bundle.js' : '[name].[chunkhash].js',
    publicPath: '/assets/',
  },
  devServer: {
    contentBase: `${__dirname}/src`,
    historyApiFallback: true,
    stats: {
      chunks: false,
    },
  },
};

module.exports = merge.smart(
  config,
  cssConfig,
  jsConfig
);
