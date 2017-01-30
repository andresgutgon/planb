"use strict";

// Server
const fs = require('fs');
const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const { argv } = require('yargs');
const chalk = require('chalk');

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------
const PRODUCT = 'planb.org';
const app = express();
const config = require('../config.json');

app.set('port', config.server.port);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');

app.locals.development = app.get('env') === 'development';
app.locals.production = !app.locals.development;

// View options
app.locals.pretty = app.locals.development || argv.pretty ? '  ' : false;
app.locals.cache = app.locals.production && argv.nocache === undefined;

if ( app.locals.development ) {
  console.log(chalk.yellow(`Starting ${PRODUCT} in ${app.get('env')} mode`));
}

// ------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

if ( app.locals.development ) {
  const webpack = require('webpack');
  const webpackConfig = require('../webpack.js.config');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true,
      reasons: false,
    }
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler, {
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }));

  app.locals.bundle = 'main.js';
  app.locals.css = 'styles.css';
} else {
  app.locals.bundle = fs.readFileSync(`./public/js/${config.manifest.js}`);
  app.locals.css = fs.readFileSync(`./public/css/${config.manifest.css}`);
}

// Static Assets
//noinspection JSUnusedGlobalSymbols
app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  setHeaders: res => {
    // Send immutable Cache-Control flag
    // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
    res.set('Cache-Control', 'public,max-age=31536000,immutable');
  }
}));

// React server-side rendering
app.get('*', (req, res) => {
  let chunk;

  if ( app.locals.production ) {
    // Get code-split chunk's relative path for this path
    // @see ./process-manifest.js to see how we populate config -- not clean, but it works
    chunk = config.routes[req.path];
  }

  res.render('index', { chunk });
});

// Page not found

// eslint-disable-next-line
app.use((req, res) => {
  res.status(404);

  if ( req.accepts('html', '*/*') === 'html' ) {
    res.render('404');
    return;
  }

  if ( req.accepts('json', '*/*') === 'json' ) {
    res.send({error: 'Not found'});
    return;
  }

  res.type('txt').send();
});

// Error handling
//noinspection JSUnusedLocalSymbols
app.use((err, req, res, next) => {
  res.status(500);

  if ( req.accepts('html', '*/*') === 'html' ) {
    // HTML
    res.render('500', {error: err});
  } else if ( req.accepts('json', '*/*') === 'json' ) {
    // JSON
    if ( err instanceof Error ) {
      if ( req.app.locals.development ) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        res.json({error: errorResponse});
      } else {
        // Only keep message in production because Error() may contain sensitive information
        res.json({error: {message: err.message}});
      }
    } else {
      res.send({error: err});
    }
  } else {
    // default to plain-text.
    // keep only message
    res.type('txt').send(err.message);
  }
});

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------
// TODO: remove `localhost` and make it dynamic for production
const server = app.listen(app.get('port'), 'localhost', () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(chalk.blue(`${PRODUCT} listening at http://${host}:${port}`));
});

server.on('error', (err) => {
  if ( err.code === 'EADDRINUSE' ) {
    console.error(chalk.red(`${PRODUCT} address in use, exiting...`));
    process.exit(0);
  } else {
    console.error(err.stack);
    throw err;
  }
});

function shutdown(code) {
  console.log(chalk.blue(`shutting down ${PRODUCT}`));
  server.close();
  process.exit(code || 0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', function(err) {
  console.error(err.stack);
  shutdown(1);
});
