const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.js.config');
const webpackCompiler = webpack(webpackConfig);

export default function hotMiddleware(app) {
  if (!app.locals.development) return  (req, res, next) => next();

  return [
    webpackDevMiddleware(webpackCompiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true,
        reasons: false,
      }
    }),
    webpackHotMiddleware(webpackCompiler, {
      path: '/__webpack_hmr',
      heartbeat: 10 * 1000,
    })
  ];
}
