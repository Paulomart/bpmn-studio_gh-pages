'use strict';

const {ProcessModelUseCases} = require('./dist/commonjs/index');

function registerInContainer(container) {
  container
    .register('ProcessModelUseCases', ProcessModelUseCases)
    .dependencies(
      'CorrelationService',
      'ExternalTaskService',
      'FlowNodeInstanceService',
      'IamService',
      'LoggingApiService',
      'ProcessModelService',
    )
    .singleton();
}

module.exports.registerInContainer = registerInContainer;
