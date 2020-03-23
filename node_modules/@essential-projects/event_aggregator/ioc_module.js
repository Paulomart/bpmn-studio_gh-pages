'use strict';

const EventAggregator = require('./dist/commonjs/index').EventAggregator;

function registerInContainer(container) {

  container.register('EventAggregator', EventAggregator)
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
