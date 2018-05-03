const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'client', 'polyfills');
const DST_DIR = path.join(ROOT_DIR, 'polyfills');
const DST_ESM_INDEX_FILE = path.join(DST_DIR, 'index.esm.js');
const DST_CJS_INDEX_FILE = path.join(DST_DIR, 'index.js');


const POLYFILLS = [
  // 'template.js',
  'custom-element.js',
  'array-find.js',
  'array-includes.js',
  'object-assign.js',
  'string-startswith.js',
  'string-endswith.js',
  'promise.js',
  // 'fetch.js',
  'request-animation-frame.js',
  'closest.js',
  'performance-now.js',
  'remove-element.js',
  'object-entries.js',
];


function buildPolyfills() {
  fs.emptyDirSync(DST_DIR);

  const polyfills = POLYFILLS.map(fileName => {
    const srcFilePath = path.join(SRC_DIR, fileName);
    const dstFilePath = path.join(DST_DIR, fileName);

    const srcContent = fs.readFileSync(srcFilePath, 'utf-8');
    fs.writeFileSync(dstFilePath, srcContent);

    return srcContent;
  }).join('\n');

  const indexEsm = [
    'export default function applyPolyfills(window) {',
    'var document = window.document',
    polyfills,
    '}'
  ];

  fs.writeFileSync(DST_ESM_INDEX_FILE, indexEsm.join('\n'));

  const indexCjs = [
    'exports.applyPolyfills = function(window) {',
    'var document = window.document',
    polyfills,
    '};'
  ];

  fs.writeFileSync(DST_CJS_INDEX_FILE, indexCjs.join('\n'));
}


buildPolyfills();
