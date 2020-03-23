const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'consumer_api_client_bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'consumerApiClient'
  },
};
