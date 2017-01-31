import path from 'path';
import express from 'express';

let staticFn;
export default function staticMiddleware(req, res, next) {
  if (staticFn) return staticFn(req, res, next);

  staticFn = express.static(path.join(__dirname, '../../public'), {
    index: false,
    setHeaders: (res) => {
      // Send immutable Cache-Control flag
      // Set s-maxage to 1 month because JS/CSS are updated often, no reason to keep them in CloudFront
      // https://bitsup.blogspot.com/2016/05/cache-control-immutable.html
      res.set('Cache-Control', 'public,max-age=31536000,s-maxage=2592000,immutable');
    },
  });

  return staticFn(req, res, next);
}
