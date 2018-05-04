import * as d from '../../declarations';
import { copyComponentStyles } from '../copy/copy-styles';
import { generateDistModuleIndex } from './dist-module-index';
import { generateTypes } from '../collections/collection-types';
import { hasError, pathJoin } from '../util';
import { validatePackageJson } from './validate-package-json';


export async function generateDistributions(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx): Promise<any> {
  const distOutputs = config.outputTargets.filter(o => o.type === 'dist');

  return Promise.all(distOutputs.map(outputTarget => {
    return generateDistribution(config, compilerCtx, buildCtx, outputTarget);
  }));
}


async function generateDistribution(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetDist): Promise<any> {
  const pkgData = await readPackageJson(config, compilerCtx);

  validatePackageJson(config, outputTarget, buildCtx.diagnostics, pkgData);

  if (hasError(buildCtx.diagnostics)) {
    return;
  }

  await Promise.all([
    generateDistModuleIndex(config, compilerCtx, outputTarget),
    copyComponentStyles(config, compilerCtx, buildCtx),
    generateTypes(config, compilerCtx, buildCtx, pkgData)
  ]);
}


async function readPackageJson(config: d.Config, compilerCtx: d.CompilerCtx) {
  const pkgJsonPath = config.sys.path.join(config.rootDir, 'package.json');

  let pkgJson: string;
  try {
    pkgJson = await compilerCtx.fs.readFile(pkgJsonPath);

  } catch (e) {
    throw new Error(`Missing "package.json" file for distribution: ${pkgJsonPath}`);
  }

  let pkgData: d.PackageJsonData;
  try {
    pkgData = JSON.parse(pkgJson);

  } catch (e) {
    throw new Error(`Error parsing package.json: ${pkgJsonPath}, ${e}`);
  }

  return pkgData;
}


export function getComponentsDtsSrcFilePath(config: d.Config) {
  return pathJoin(config, config.srcDir, COMPONENTS_DTS);
}


export function getComponentsDtsTypesFilePath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.typesDir, COMPONENTS_DTS);
}


export const COMPONENTS_DTS = 'components.d.ts';
