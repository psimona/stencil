const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.esm.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'esm-imports'),
    filename: 'webpack.bundle.js',
    publicPath: '/esm-imports/'
  },
  // mode: 'production'
  mode: 'development'
};
