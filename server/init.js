import { argv } from 'yargs';
import chalk from 'chalk';
import express from 'express';

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

  return app;
}
