'use strict';

const TimerService = require('./dist/commonjs/index').TimerService;

function registerInContainer(container) {

  container.register('TimerService', TimerService)
    .dependencies('EventAggregator');
}

module.exports.registerInContainer = registerInContainer;
