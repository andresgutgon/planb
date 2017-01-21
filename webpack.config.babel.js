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
              ]
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
