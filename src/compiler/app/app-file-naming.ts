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


export function getGlobalEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.global.esm.js`;
}


export function getGlobalEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getGlobalEsmFileName(config));
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


export function getCoreEsmFileName(config: d.Config) {
  return `${config.fsNamespace}.esm.js`;
}


export function getCoreEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), getCoreEsmFileName(config));
}


export function getComponentsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), `components.esm.js`);
}


export function getPolyfillsEsmBuildPath(config: d.Config, outputTarget: d.OutputTargetWww) {
  return pathJoin(config, getAppBuildDir(config, outputTarget), `polyfills.esm.js`);
}


export function getGlobalStyleFilename(config: d.Config) {
  return `${config.fsNamespace}.css`;
}


export function getBundleFilename(bundleId: string, isScopedStyles: boolean, sourceTarget?: d.SourceTarget) {
  return `${bundleId}${isScopedStyles ? '.sc' : ''}${sourceTarget === 'es5' ? '.es5' : ''}.js`;
}
