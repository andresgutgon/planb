import path from 'path';
import favicon from 'serve-favicon';

export default function faviconMiddleware(req, res, next) {
  favicon(path.join(__dirname, '../../public', 'favicon.ico'));
  next();
}
