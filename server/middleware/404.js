export default function notFoundMiddleware(req, res, next) {
  res.status(404);

  if (req.accepts('html', '*/*') === 'html') {
    res.render('404');
    return;
  }

  if ( req.accepts('json', '*/*') === 'json' ) {
    res.send({ error: 'Not found' });
    return;
  }

  res.type('txt').send();
}
