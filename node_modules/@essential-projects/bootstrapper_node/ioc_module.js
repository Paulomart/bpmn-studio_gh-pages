'use strict';

const AppBootstrapper = require('./dist/commonjs/index').AppBootstrapper;

function registerInContainer(container) {

  container.register('AppBootstrapper', AppBootstrapper)
    .dependencies('container', 'ExtensionBootstrapper')
    .injectPromiseLazy('ExtensionBootstrapper')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
