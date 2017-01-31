function getError(err, req, res, next) {
  if (!req.app.locals.development ) return err.message;

  const error = {};

  Object.getOwnPropertyNames(err).forEach(key => {
    error[key] = err[key];
  });

  return error;
}

export default function serverErrorMiddleware(err, req, res, next) {
  res.status(500);

  // HTML
  if ( req.accepts('html', '*/*') === 'html' ) {
    res.render('500', {error: err});
    return;
  }

  // JSON
  if ( req.accepts('json', '*/*') === 'json' ) {
    if ( err instanceof Error ) {
      const error = getError(err, req, res);
      return res.json({ error });
    } else {
      return res.send({ error: err });
    }
  }

  // default to plain-text.
  // keep only message
  res.type('txt').send(err.message);
}
