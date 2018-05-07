import * as d from '../../declarations';
import { copyEsmCorePolyfills } from '../app/app-polyfills';
import { generatePreamble, normalizePath } from '../util';
import { getComponentsEsmBuildPath, getCoreEsmBuildPath, getDistIndexCjsPath, getDistIndexEsmPath } from '../app/app-file-naming';


export async function generateDistModuleIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const cjs: string[] = [
    generatePreamble(config, `${config.namespace}: CommonJS Main`)
  ];
  const esm: string[] = [
    generatePreamble(config, `${config.namespace}: ES Module`)
  ];

  const componentsEsm = getComponentsEsmBuildPath(config, outputTarget);
  const coreEsm = getCoreEsmBuildPath(config, outputTarget);

  await Promise.all([
    addExport(config, compilerCtx, outputTarget, esm, componentsEsm),
    addExport(config, compilerCtx, outputTarget, esm, coreEsm)
  ]);

  const distIndexCjsPath = getDistIndexCjsPath(config, outputTarget);
  const distIndexEsmPath = getDistIndexEsmPath(config, outputTarget);

  await Promise.all([
    compilerCtx.fs.writeFile(distIndexCjsPath, cjs.join('\n')),
    compilerCtx.fs.writeFile(distIndexEsmPath, esm.join('\n')),
    copyEsmCorePolyfills(config, compilerCtx, outputTarget)
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
