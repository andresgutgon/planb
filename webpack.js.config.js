const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpack = require('webpack');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

// TODO: implement production build
const DEV = true;

const config = {
  entry: {
    main: [
      path.resolve(__dirname, 'client/main.js'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015',
                'react',
                'stage-0'
              ],
              // TODO: maybe add babel-transform-runtime
              // http://babeljs.io/docs/plugins/transform-runtime/
              // transform-runtime
              plugins: [
                'syntax-dynamic-import',
                'transform-class-properties',
                'react-hot-loader/babel',
              ],
            }
          }
        ],
        exclude: /node_modules/,
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
}

module.exports = config;
