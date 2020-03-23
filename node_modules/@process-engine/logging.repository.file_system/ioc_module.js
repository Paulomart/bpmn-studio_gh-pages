'use strict';

const LoggingRepository = require('./dist/commonjs/index').LoggingRepository;

function registerInContainer(container) {

  container
    .register('LoggingRepository', LoggingRepository)
    .configure('process_engine:logging_repository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
