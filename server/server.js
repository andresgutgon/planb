import chalk from 'chalk';

import initExpress from './init';

// Middlewares
import faviconMiddleware from './middleware/favicon';
import hotMiddleware from './middleware/hot';
import staticMiddleware from './middleware/static';
import reactMiddleware from './middleware/react';
import notFoundMiddleware from './middleware/404';
import serverErrorMiddleware from './middleware/500';

// Server-side rendering
// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------
const config = require('../config.json');
const PRODUCT = config.server.appName;
const app = initExpress(config);

// ------------------------------------------------------------------------------
// Middlewares
// ------------------------------------------------------------------------------
app.use(faviconMiddleware);
app.use(hotMiddleware(app));
app.use(staticMiddleware);
app.use(reactMiddleware(config));
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
