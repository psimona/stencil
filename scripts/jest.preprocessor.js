const tsc = require('typescript');
const tsConfig = require('../src/tsconfig.json');

// force the output to use commonjs modules required by jest
tsConfig.compilerOptions.module = 'commonjs';
tsConfig.compilerOptions.target = 'es2015';

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts')) {
      return tsc.transpile(
        src,
        tsConfig.compilerOptions,
        path,
        []
      );
    }
    return src;
  },
};
