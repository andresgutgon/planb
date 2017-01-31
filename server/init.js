import { argv } from 'yargs';
import chalk from 'chalk';
import express from 'express';

function setWebpackAssets(app, config) {
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

export default function initExpress(config) {
  const app = express();

  app.set('port', config.server.port);
  app.set('view engine', 'pug');
  app.set('views', `${__dirname}/views`);
  app.enable('case sensitive routing');
  app.enable('strict routing');
  app.disable('x-powered-by');
  app.locals.development = app.get('env') === 'development';
  app.locals.production = !app.locals.development;

  // View options
  app.locals.cache = app.locals.production && argv.nocache === undefined;

  if ( app.locals.development ) {
    console.log(
      chalk.yellow(`Starting ${config.server.appName} in ${app.get('env')} mode`)
    );
  }

  const chunks = setWebpackAssets(app, config);

  return {
    app,
    chunks,
  };
}
