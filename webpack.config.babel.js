import webpack from 'webpack';

export default {
  context: `${__dirname}/src`,
  entry: {
    app: './index.js',
  },
  output: {
    path: `${__dirname}/build`,
    filename: '[name].bundle.js',
    publicPath: '/assets',
  },
  devServer: {
    contentBase: `${__dirname}/src`,
    historyApiFallback: true,
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
      {
        test: /\.(sass|scss)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      }
    ]
  }
};
