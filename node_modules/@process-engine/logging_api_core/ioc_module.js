'use strict';

const LoggingApiService = require('./dist/commonjs/index').LoggingApiService;

function registerInContainer(container) {

  container
    .register('LoggingApiService', LoggingApiService)
    .dependencies('IamService', 'LoggingRepository')
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
