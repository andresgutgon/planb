const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

// TODO: make production webpack build
// const PRODUCTION = process.env.NODE_ENV === 'production';
const PRODUCTION = false;
const DEV = !PRODUCTION;

module.exports = {
  entry: {
    coreCSS: path.resolve(__dirname, 'src/styles/layout.scss'),
  },
  devtool: DEV ? 'inline-source-map' : undefined,
  module: {
    rules: [
      {
        // Only for Core Styles
        // Extract it into index.html head
        test: /\.scss?$/,
        include: [
          path.resolve(__dirname, 'src/styles'),
        ],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              query: {
                // modules: true,
                // importLoaders: 2,
                sourceMap: false,
                calc: false,
                zindex: false,
                discardComments: { removeAll: true },
              }
            },
            { loader: 'postcss-loader' },
            {
              loader: 'sass-loader',
              query: {
                sourceMap: DEV,
                outputStyle: 'compact',
                precision: 6
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': DEV ? JSON.stringify('development') : JSON.stringify('production')
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: PRODUCTION,
      debug: false,
      options: {
        context: __dirname,
        postcss: [
          autoprefixer({
            remove: false,
            browsers: [ '> 4%' ]
          })
        ]
      }
    }),
    new ExtractTextPlugin({
      filename: DEV ? 'styles.css' : '[contenthash].css'
    })
  ]
};
