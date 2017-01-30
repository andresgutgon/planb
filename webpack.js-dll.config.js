const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const DllPlugin = require('webpack/lib/DllPlugin');

const config = {
  target: 'web',
  performance: {
    hints: false
  },
  entry: {
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'nprogress',
      'react-router',
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
    library: 'vendor',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        include: __dirname,
        loader: 'babel-loader?cacheDirectory'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new DllPlugin({
      path: path.resolve(__dirname, 'public/js/vendor-manifest.json'),
      name: 'vendor'
    }),
  ]
};

module.exports = config;
