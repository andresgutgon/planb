import chalk from 'chalk';

import initExpress from './init';

// Middlewares
import faviconMiddleware from './middleware/favicon';
import hotMiddleware from './middleware/hot';
import staticMiddleware from './middleware/static';
import notFoundMiddleware from './middleware/404';
import serverErrorMiddleware from './middleware/500';

// Server-side rendering
import React from 'react';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';
import Layout from '../client/containers/Layout';

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------
const config = require('../config.json');
const PRODUCT = config.server.appName;
const { app, chunks } = initExpress(config);

// ------------------------------------------------------------------------------
// Middlewares
// ------------------------------------------------------------------------------
app.use(faviconMiddleware);
app.use(hotMiddleware(app));
app.use(staticMiddleware);

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

// React server-side rendering
app.get('*', (req, res, next) => {
  // Uncomment to skip server-side rendering
  // res.render('index', {
  //   ie: req.get('user-agent').indexOf('MSIE') > -1,
  // });
  // return;

  let css, head, chunk;

  const context = {};
  const html = renderToString(
    <StaticRouter location={req.url} context={context}>
      <Layout/>
    </StaticRouter>
  );
  const result = context;

  if (result.redirect) {
    res.redirect(302, result.redirect.pathname);
    return;
  }

  if (result.missed) {
    // We could re-render here, for the Miss component to pickup the 404.
    // Instead, let the client do the hard work
    // NOTE: It is unfortunate that we have to server-side render for invalid URLs
    res.status(404).render('index', {
      head: {
        title: '<title>Page not found</title>'
      }
    });
    return;
  }

  if (req.app.locals.production) {
    // Get code-split chunk's relative path for this path
    // @see ./process-manifest.js to see how we populate config -- not clean, but it works
    if ( config.routes[req.path] !== undefined ) {
      chunk = config.routes[req.path];
    }
  }

  // We're done, render the view
  res.render('index', {
    html,
    head,
    chunks,
    chunk,
    ie: req.get('user-agent').indexOf('MSIE') > -1,
  });
});

app.use(notFoundMiddleware);
app.use(serverErrorMiddleware);

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------
const server = app.listen(app.get('port'), () => {
  let host = server.address().address;
  let port = server.address().port;

  host = host === '::' ? 'localhost' : host;
  console.log(chalk.green(`${PRODUCT} listening at http://${host}:${port}`));
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
