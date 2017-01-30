const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpack = require('webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;

const config = {
  target: 'web',
  performance: { hints: false },
  entry: {
    main: [
      path.resolve(__dirname, 'client/main.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: DEV ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: DEV ? '[name].js' : '[name].[chunkhash].js',
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: __dirname,
        loader: 'babel-loader?cacheDirectory'
      },
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production')
    }),
  ]
};

if (DEV) {
  const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
  const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');
  const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

  config.entry.main.unshift(
    'webpack-hot-middleware/client',
    'react-hot-loader/patch'
  );

  // Uncomment me to test async routes
  // WARNING: Breaks routes hot loading!
  // config.plugins.push(
  //   new NormalModuleReplacementPlugin(
  //     /^\.\.\/routes\/Routes$/,
  //     '../routes/RoutesAsync'
  //   )
  // );

  config.plugins.push(
    new HotModuleReplacementPlugin(),
    new NoEmitOnErrorsPlugin(),
    new DllReferencePlugin({
      context: '.',
      manifest: require('./public/js/vendor-manifest.json')
    })
  );
}

module.exports = config;
