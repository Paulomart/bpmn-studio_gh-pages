'use strict';

const SolutionExplorerProcessEngineRepositoryDatastoreManagementApi = require('./dist/index').SolutionExplorerProcessEngineRepositoryDatastoreManagementApi;

function registerInContainer(container) {
  container.register('SolutionExplorer.Repository', SolutionExplorerProcessEngineRepositoryDatastoreManagementApi);
}

module.exports.registerInContainer = registerInContainer;
