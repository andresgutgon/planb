import path from 'path';
import webpack from 'webpack';

// TODO: implement production build
const DEV = true;

export default {
  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
  },
  // output: {
  //   path: path.resolve(__dirname, 'dist'),
  //   filename: DEV ? '[name].js' : '[name].[chunkhash].js',
  //   chunkFilename: DEV ? '[name].js' : '[name].[chunkhash].js',
  //   publicPath: '/js/',
  // },
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
                'react-hmre',
              ],
              // TODO: maybe add babel-transform-runtime
              // http://babeljs.io/docs/plugins/transform-runtime/
              // transform-runtime
              plugins: [
                'syntax-dynamic-import',
                'transform-class-properties',
              ],
            }
          }
        ],
        exclude: /node_modules/,
      },
    ]
  }
};
