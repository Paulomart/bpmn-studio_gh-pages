'use strict';

const {
  DynamicUIService,
} = require('./dist/commonjs/index');

function registerInContainer(container) {

  container.register('DynamicUIService', DynamicUIService);
}

module.exports.registerInContainer = registerInContainer;
