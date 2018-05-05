const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'cmp.js'),
  output: {
    path: path.resolve(__dirname, '..', '..', 'www', 'stencil-element'),
    filename: 'webpack.bundle.js'
  },
  mode: 'none'
};
