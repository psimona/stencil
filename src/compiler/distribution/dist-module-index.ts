import * as d from '../../declarations';
import { generatePreamble, normalizePath, pathJoin } from '../util';
import { getComponentsEsmBuildPath, getCoreEsmBuildPath, getPolyfillsEsmBuildPath } from '../app/app-file-naming';


export async function generateDistModuleIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const distIndexCjsPath = pathJoin(config, outputTarget.dir, 'index.js');
  const distIndexEsmPath = pathJoin(config, outputTarget.dir, 'index.esm.js');

  const cjs: string[] = [
    generatePreamble(config, `CommonJS Main`)
  ];
  const esm: string[] = [
    generatePreamble(config, `ES Module`)
  ];

  const collectionIndexJs = pathJoin(config, outputTarget.collectionDir, 'index.js');
  const componentsEsm = getComponentsEsmBuildPath(config, outputTarget);
  const coreEsm = getCoreEsmBuildPath(config, outputTarget);

  await Promise.all([
    addExport(config, compilerCtx, outputTarget, esm, collectionIndexJs),
    addExport(config, compilerCtx, outputTarget, esm, componentsEsm),
    addExport(config, compilerCtx, outputTarget, esm, coreEsm)
  ]);

  await Promise.all([
    compilerCtx.fs.writeFile(distIndexCjsPath, cjs.join('\n')),
    compilerCtx.fs.writeFile(distIndexEsmPath, esm.join('\n')),
    copyPolyfills(config, compilerCtx, outputTarget)
  ]);
}


async function addExport(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist, esm: string[], filePath: string) {
  const fileExists = await compilerCtx.fs.access(filePath);
  if (fileExists) {
    const relPath = './' + normalizePath(config.sys.path.relative(outputTarget.dir, filePath));

    esm.push(
      `export * from '${relPath}';`
    );
  }
}


async function copyPolyfills(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const polyfillsPath = getPolyfillsEsmBuildPath(config, outputTarget);
  const polyfillsContent = await config.sys.getClientCoreFile({ staticName: 'polyfills.esm.js' });

  await compilerCtx.fs.writeFile(polyfillsPath, polyfillsContent);
}
