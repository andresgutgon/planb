## TODO

- [x] Setup webpack 2
- [x] Setup Babel
- [x] Hot Module Replacement HMR
- [x] React
- [x] Add HMR for React
- [x] React Router 4
- [x] Code Splitting (test with lodash)
- [x] Setup global styles folder
- [x] Add nprogress
- [x] Add react-hot-loader
- [x] Add RedboxReact (helpful errors on development)
- [ ] Transform project into a server side project

- [ ] Add Mobx
- [ ] Add bootstrap styles
- [ ] Add CSSModules
- [ ] Add Flow
- [ ] Add react-boostrap

## Webpack TODO
- [ ] Use HtmlWebpackPlugin
- [ ] Make vendor bundle
- [ ] Refactor Webpack config (optional before demo)
- [ ] Setup Webpack for production

## Future TODO
- [ ] Investigate setup manifest. It's related with webworkers.
- [ ] Pollyfill for Old browsers [polyfill.io](https://polyfill.io/v2/docs/) Check [this project](https://github.com/LWJGL/lwjgl3-www)

## NOTES on async routes
Routes are lazy loaded in production. In development all the javascript
load at the same time. This is a limitation due to the fact that async routes
break React Hot Reloading.

## Improve Webpack Config
Start [reading here](http://survivejs.com/webpack/developing-with-webpack/splitting-configuration/)

## Webpack Dev Server
```
webpack-dev-server --progress --inline
```
`--progress` displays the compilation progress when building
`--inline` adds webpacks automatic refresh code inline with the compile application
`--hot` Switch the server to **hot** mode. DON't use if you're using webpack Hotmodulereplacementplugin

## References
* [Code Splitting article](https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c#.epngc9khn)
* [Code splitting project](https://github.com/LWJGL/lwjgl3-www/)
* [react-hot-module-replacement-with-webpack](http://matthewlehner.net/react-hot-module-replacement-with-webpack/)

## DEVELOPMENT
`yarn start`
