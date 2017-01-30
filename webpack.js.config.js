const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEV = !PRODUCTION;

const config = {
  target: 'web',
  entry: {
    main: [
      path.resolve(__dirname, 'client/main.js')
    ]
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
      'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production')
    }),
    new DllReferencePlugin({
      context: '.',
      manifest: require('./public/js/vendor-manifest.json')
    })
  ]
};

if ( DEV ) {
  const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
  const NoEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin');

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
    new NoEmitOnErrorsPlugin()
  );
} else {
  const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
  const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
  const IgnorePlugin = require("webpack/lib/IgnorePlugin");
  const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

  config.plugins.push(
    new LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new IgnorePlugin(/(react-hot-loader)/),
    new NormalModuleReplacementPlugin(
      /^\.\.\/routes\/Routes$/,
      '../routes/RoutesAsync'
    ),
    new ChunkManifestPlugin({
      filename: 'manifest.json',
      manifestVariable: "manifest",
    }),
    new UglifyJsPlugin({
      sourceMap: false,
      mangle: {
        screw_ie8: true,
        except: []
      },
      comments: false,
      compress: {
        screw_ie8: true,
        sequences: true,
        properties: true,
        dead_code: true,
        drop_debugger: true,
        unsafe: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        cascade: true,
        warnings: false,
        negate_iife: true,
        pure_getters: true,
        pure_funcs: null,
        drop_console: true,
        keep_fargs: false,
        keep_fnames: false
      }
    })
  );
}

module.exports = config;
