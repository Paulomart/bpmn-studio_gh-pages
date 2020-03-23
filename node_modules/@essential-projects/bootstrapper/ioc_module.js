'use strict';

const ExtensionBootstrapper = require('./dist/commonjs/index').ExtensionBootstrapper;

function registerInContainer(container) {

  container.register('ExtensionBootstrapper', ExtensionBootstrapper)
    .dependencies('container');
}

module.exports.registerInContainer = registerInContainer;
