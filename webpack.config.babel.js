import webpack from 'webpack';

export default {
  context: `${__dirname}/src`,
  entry: {
    app: './app.js',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: `${__dirname}/src`,
  },
};
