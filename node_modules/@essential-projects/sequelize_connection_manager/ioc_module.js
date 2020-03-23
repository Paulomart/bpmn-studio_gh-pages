'use strict';

const SequelizeConnectionManager = require('./dist/commonjs/index').SequelizeConnectionManager;

function registerInContainer(container) {

  container
    .register('SequelizeConnectionManager', SequelizeConnectionManager)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
