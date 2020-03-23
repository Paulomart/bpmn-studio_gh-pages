'use strict';

const HttpClient = require('./dist/commonjs/index').HttpClient;

function registerInContainer(container) {

  container.register('HttpClient', HttpClient)
    .configure('http:http_client')
    .singleton();

}

module.exports.registerInContainer = registerInContainer;
