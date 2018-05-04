import { buildCoreContent } from './build-core-content';
import { BuildConditionals, BuildCtx, CompilerCtx, Config, OutputTarget } from '../../declarations';
import { getCoreEsmBuildPath, getGlobalEsmFileName } from './app-file-naming';


export async function generateEsmCore(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, outputTarget: OutputTarget, hasAppGlobalImport: boolean, buildConditionals: BuildConditionals) {
  // mega-minify the core w/ property renaming, but not the user's globals
  // hardcode which features should and should not go in the core builds
  // process the transpiled code by removing unused code and minify when configured to do so
  let jsContent = await config.sys.getClientCoreFile({ staticName: 'core.esm.js' });

  if (hasAppGlobalImport) {
    jsContent = `import appGlobal from './${getGlobalEsmFileName(config)}';\n${jsContent}`;
  } else {
    jsContent = `const appGlobal = () => {};\n${jsContent}`;
  }

  jsContent = await buildCoreContent(config, compilerCtx, buildCtx, buildConditionals, jsContent);

  const coreEsm = getCoreEsmBuildPath(config, outputTarget);

  await compilerCtx.fs.writeFile(coreEsm, jsContent);
}
