const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');


module.exports = function buildPolyfills(outputPolyfillsEsmDir) {
  fs.emptyDirSync(outputPolyfillsEsmDir);

  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.js'));

  files.forEach(fileName => {
    const srcFilePath = path.join(SRC_DIR, fileName);
    const dstFilePath = path.join(outputPolyfillsEsmDir, fileName);

    const polyfillWrapped = [
      'export function applyPolyfill(window, document) {',
      fs.readFileSync(srcFilePath, 'utf-8'),
      '}'
    ].join('\n');

    fs.writeFileSync(dstFilePath, polyfillWrapped);
  });
};
