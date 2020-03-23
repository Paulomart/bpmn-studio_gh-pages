'use strict';

const SolutionExplorerFileSystemRepository = require('./dist/index').SolutionExplorerFileSystemRepository;

function registerInContainer(container) {
  container.register('SolutionExplorer.Repository', SolutionExplorerFileSystemRepository);
}

module.exports.registerInContainer = registerInContainer;
