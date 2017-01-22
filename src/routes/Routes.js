/**
 * NOTE: to make Hot Module Reloading work we load
 * all the javascript on an unique webpack bundle.
 * In production we use async loaded routs. Take a look into
 * './RoutesAsync.js'
 * This implies route declarations duplications.
 * But I think is a trade off we can accept to have:
 * 1. Async routes on production
 * 2. Hot Reloading on development
 *
 * IMPORTANT:
 * remember to add the route also in './RoutesAsync.js'
 */
export { default as Home } from './Home';
export { default as HelloWorld } from './HelloWorld';
export { default as Bye } from './Bye';
