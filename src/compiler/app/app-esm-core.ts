import { buildCoreContent } from './build-core-content';
import { BuildConditionals, BuildCtx, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { generatePreamble } from '../util';
import { getCoreEsmBuildPath, getGlobalEsmFileName } from './app-file-naming';


export async function generateEsmCore(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, hasAppGlobalImport: boolean, buildConditionals: BuildConditionals) {
  // mega-minify the core w/ property renaming, but not the user's globals
  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  let jsContent = await config.sys.getClientCoreFile({ staticName: 'core.esm.js' });

  if (hasAppGlobalImport) {
    jsContent = `import appGlobal from './${getGlobalEsmFileName(config)}';\n${jsContent}`;
  } else {
    jsContent = `var appGlobal = function(){};\n${jsContent}`;
  }

  await generateEsmCoreEs5(config, compilerCtx, buildCtx, outputTarget, buildConditionals, jsContent);
}


async function generateEsmCoreEs5(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, buildConditionals: BuildConditionals, jsContent: string) {
  buildConditionals.es5 = true;
  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  const coreEsm = getCoreEsmBuildPath(config, outputTarget, 'es5');

  // fighting with typescript/webpack/es5 builds too much
  // hack to keep polyfill imports still as import()
  // #dealwithit
  jsContent = jsContent.replace(/require\(\'\.\/polyfills/g, 'import(\'./polyfills');
  jsContent = jsContent.replace('exports.applyPolyfills = applyPolyfills;', '');
  jsContent = jsContent.replace('exports.customElementsDefine = customElementsDefine;', '');

  jsContent = generatePreamble(config, `${config.namespace}: Core, ES5`) + '\n' + jsContent;

  await compilerCtx.fs.writeFile(coreEsm, jsContent);
}
