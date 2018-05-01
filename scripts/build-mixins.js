const fs = require('fs-extra');
const path = require('path');
const rollup = require('rollup');
const minifyCoreBuild = require('../dist/compiler/index.js').minifyCoreBuild;


const stencilElementBuild = {

};


const minifyOpts = {
  preamble: true,
  sourceTarget: 'esm'
};


function buildMixins(inputMixinFile, outputMixinFile) {
  return rollup.rollup({
    input: inputMixinFile,
    onwarn: (message) => {
      if (/top level of an ES module/.test(message)) return;
      console.error( message );
    }
  })
  .then(bundle => {
    bundle.generate({
      format: 'es'

    }).then(clientCore => {

      let code = clientCore.code.trim();

      minifyCoreBuild(code, stencilElementBuild, minifyOpts).then(results => {
        code = results.output;

        fs.writeFile(outputMixinFile, code, (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }

          const dtsFileName = path.basename(inputMixinFile, '.js') + '.d.ts';
          const inputDts = path.join(path.dirname(inputMixinFile), dtsFileName);
          const outputDts = path.join(path.dirname(outputMixinFile), dtsFileName);

          fs.copySync(inputDts, outputDts);
        });
      });

    })
  })
  .catch(err => {
    console.log(err);
    console.log(err.stack);
    process.exit(1);
  });
}

module.exports = buildMixins;
