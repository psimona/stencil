import * as d from '../../declarations';
import { pathJoin } from '../util';


export function getAppBuildDir(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, outputTarget.buildDir, config.fsNamespace);
}


export function getRegistryFileName(config: d.Config) {
  return `${config.fsNamespace}.registry.json`;
}


export function getRegistryJson(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getRegistryFileName(config));
}


export function getLoaderFileName(config: d.Config) {
  return `${config.fsNamespace}.js`;
}


export function getLoaderPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, outputTarget.buildDir, getLoaderFileName(config));
}


export function getGlobalFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}



export function getGlobalJsBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getGlobalFileName(config));
}


export function getCoreFilename(config: d.Config, coreId: string, jsContent: string) {
  if (config.hashFileNames) {
    // prod mode renames the core file with its hashed content
    const contentHash = config.sys.generateContentHash(jsContent, config.hashedFileNameLength);
    return `${config.fsNamespace}.${contentHash}.js`;
  }

  // dev file name
  return `${config.fsNamespace}.${coreId}.js`;
}


export function getDistIndexCjsPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.buildDir, 'index.js');
}


export function getDistIndexEsmPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.buildDir, 'index.esm.js');
}


export function getCoreEsmBuildDir(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, outputTarget.buildDir, 'esm');
}


export function getCoreEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `es5`, `${config.fsNamespace}.core.js`);
  }
  return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `${config.fsNamespace}.core.js`);
}


export function getGlobalEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.global.js`;
}


export function getGlobalEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `es5`, getGlobalEsmFileName(config));
  }
  return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), getGlobalEsmFileName(config));
}


export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist, sourceTarget: d.SourceTarget) {
  if (sourceTarget === 'es5') {
    return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `es5`, `${config.fsNamespace}.components.js`);
  }
  return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `${config.fsNamespace}.components.js`);
}


export function getPolyfillsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetDist) {
  return pathJoin(config, getCoreEsmBuildDir(config, outputTarget), `es5`, `polyfills`);
}


export function getGlobalStyleFilename(config: d.Config) {
  return `${config.fsNamespace}.css`;
}


export function getBundleFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.js`;
}
