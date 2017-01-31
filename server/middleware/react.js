import { match } from 'react-router';

function handleRouter(req, res, props, ssr) {
  console.log('route:', req.url); // eslint-disable-line no-console
  if (req.url !== '/favicon.ico') ssr(req, res, props);
}

function handleRedirect(res, redirect) {
  res.redirect(302, redirect.pathname + redirect.search);
}

function handleNotFound(res) {
  res.status(404).send('Not Found');
}

function handleError(res, err) {
  res.status(500).send(err.message);
}

function routingMiddleware(routes, ssr) {
  return (req, res) => {
    match({ routes, location: req.url },
          (err, redirect, props) => {
            if (err) handleError(res, err);
            else if (redirect) handleRedirect(res, redirect);
            else if (props) handleRouter(req, res, props, ssr);
            else handleNotFound(res);
          });
  };
}

import React from 'react';
import { renderToString } from 'react-dom/server';
import StaticRouter from 'react-router-dom/StaticRouter';

import Layout from '../../client/containers/Layout';

/**
 * Get code-split chunk's relative path for this path
 * @see ./process-manifest.js to see how we populate config
 * not clean, but it works
 *
 * @param {Object} req
 * @param {Object} config
 * @return {Maybe<Object>}
 */
function getDynamicChunk(req, config) {
  const chunk = config.routes[req.path];

  if (!req.app.locals.production || !chunk) return null;

  return chunk;
}

/**
 * Get main webpack bundle for JS and CSS
 * On development is a plain string. On production
 * is a hashed name that comes from Webpack JSON manifest
 *
 * @param {Object} req
 * @param {Object} config
 * @return {Maybe<Object>}
 */
function getCoreChunks(req, config) {
  const app = req.app;
  let chunks = {};

  if (app.locals.development) {
    chunks = JSON.stringify({});
    app.locals.bundle = 'main.js';
    app.locals.css = 'styles.css';
  } else {
    chunks = JSON.stringify(config.manifest.chunks);
    app.locals.bundle = config.manifest.js;
    app.locals.css = config.manifest.css;
  }

  return chunks;
}

export default function reactMiddleware(config) {
  return (req, res) => {
    // Uncomment to skip server-side rendering
    // res.render('index', {
    //   ie: req.get('user-agent').indexOf('MSIE') > -1,
    // });
    // return;

    // TODO: use Helmet here;
    let head;

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
        head: { title: '<title>Page not found</title>' }
      });
      return;
    }

    const chunk = getDynamicChunk(req, config);
    const chunks = getCoreChunks(req, config);

    // We're done, render the view
    res.render('index', {
      html,
      head,
      chunk,
      chunks,
      ie: req.get('user-agent').indexOf('MSIE') > -1,
    });
  }
}
