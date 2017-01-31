// Server
import path from 'path';
import express from 'express';
import { argv } from 'yargs';
import chalk from 'chalk';

import initExpress from './init';
// Middlewares
import faviconMiddleware from './middleware/favicon';
import hotMiddleware from './middleware/hot';

// Server-side rendering
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerRouter, createServerRenderContext } from 'react-router';
import { StyleSheetServer } from 'aphrodite/no-important';
import Layout from '../client/containers/Layout';

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------
const config = require('../config.json');
const PRODUCT = config.server.appName;
const { app, chunks } = initExpress(config);

// ------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------
app.use(faviconMiddleware);
app.use(hotMiddleware(app));

// ------------------------------------------------------------------------------
// Routing
// ------------------------------------------------------------------------------

// Static Assets
app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  setHeaders: res => {
    // Send immutable Cache-Control flag
    // Set s-maxage to 1 month because JS/CSS are updated often, no reason to keep them in CloudFront
    // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
    res.set('Cache-Control', 'public,max-age=31536000,s-maxage=2592000,immutable');
  }
}));

// React server-side rendering
app.get('*', (req, res, next) => {
  // Uncomment to skip server-side rendering
  // res.render('index', {
  //   ie: req.get('user-agent').indexOf('MSIE') > -1,
  // });
  // return;

  let html, css, head, chunk;

  const context = createServerRenderContext();
  ({html, css} = StyleSheetServer.renderStatic( // https://github.com/Khan/aphrodite
    () => renderToString( // https://react-router.now.sh/ServerRouter
      <ServerRouter
        location={req.url}
        context={context}
      >
        {
          ({action, location, router}) =>
            <Layout router={router} action={action} location={location}/>
        }
      </ServerRouter>
    )
  ));
  const result = context.getResult();

  if ( result.redirect ) {
    res.redirect(302, result.redirect.pathname);
    return;
  }

  if ( result.missed ) {
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

  if ( app.locals.production ) {
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
    aphrodite: css,
    ie: req.get('user-agent').indexOf('MSIE') > -1,
  });
});

// Page not found

// eslint-disable-next-line
app.use((req, res, next) => {
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

// Error page
app.use((err, req, res, next) => {
  res.status(500);

  // HTML
  if ( req.accepts('html', '*/*') === 'html' ) {
    res.render('500', {error: err});
    return;
  }

  // JSON
  if ( req.accepts('json', '*/*') === 'json' ) {
    if ( err instanceof Error ) {
      if ( req.app.locals.development ) {
        const errorResponse = {};

        Object.getOwnPropertyNames(err).forEach(key => {
          errorResponse[key] = err[key];
        });

        return res.json({error: errorResponse});
      } else {
        // Only keep message in production because Error() may contain sensitive information
        return res.json({error: {message: err.message}});
      }
    } else {
      return res.send({error: err});
    }
  }

  // default to plain-text.
  // keep only message
  res.type('txt').send(err.message);
});

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------

const server = app.listen(app.get('port'), () => {
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
