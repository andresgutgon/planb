import path from 'path';
import merge from 'webpack-merge';

import jsConfig from './webpack.js.config';
import cssConfig from './webpack.css.config';

// TODO: implement production build
const DEV = true;

const commonConfig = {
  context: `${__dirname}/src`,
  target: 'web',
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

export default merge.smart(
  commonConfig,
  cssConfig,
  jsConfig
);
