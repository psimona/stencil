import * as d from '../../declarations';
import { buildError, buildWarn, normalizePath, pathJoin } from '../util';
import { COLLECTION_MANIFEST_FILE_NAME } from '../../util/constants';
import { COMPONENTS_DTS } from './distribution';
import { getDistIndexEsmPath, getLoaderFileName } from '../app/app-file-naming';


export function validatePackageJson(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  validatePackageFiles(config, outputTarget, diagnostics, pkgData);
  validateModule(config, outputTarget, diagnostics, pkgData);
  validateMain(config, outputTarget, diagnostics, pkgData);
  validateTypes(config, outputTarget, diagnostics, pkgData);
  validateCollection(config, outputTarget, diagnostics, pkgData);
  validateNamespace(config, diagnostics);
}


export function validateModule(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const modulePath = getDistIndexEsmPath(config, outputTarget);
  const moduleRelPath = normalizePath(config.sys.path.relative(config.rootDir, modulePath));

  if (!pkgData.module) {
    const err = buildWarn(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${moduleRelPath}`;

  } else if (normalizePath(pkgData.module) !== moduleRelPath) {
    const err = buildWarn(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "module" property is required when generating a distribution. It's recommended to set the "module" property to: ${moduleRelPath}`;
  }
}


export function validateMain(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const mainFileName = getLoaderFileName(config);
  const main = pathJoin(config, config.sys.path.relative(config.rootDir, outputTarget.buildDir), mainFileName);

  if (!pkgData.main || normalizePath(pkgData.main) !== main) {
    const err = buildWarn(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "main" property is required when generating a distribution and must be set to: ${main}`;
  }
}


export function validateTypes(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (typeof pkgData.types !== 'string' || pkgData.types === '') {
    const componentsDtsFileAbsPath = config.sys.path.join(outputTarget.typesDir, COMPONENTS_DTS);
    const componentsDtsFileRelPath = pathJoin(config, config.sys.path.relative(config.rootDir, componentsDtsFileAbsPath));

    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" property is required when generating a distribution. Recommended entry d.ts file is: ${componentsDtsFileRelPath}`;

  } else if (!pkgData.types.endsWith('.d.ts')) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "types" file must have a ".d.ts" extension: ${pkgData.types}`;
  }
}


export function validateCollection(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  const collection = pathJoin(config, config.sys.path.relative(config.rootDir, outputTarget.collectionDir), COLLECTION_MANIFEST_FILE_NAME);
  if (!pkgData.collection || normalizePath(pkgData.collection) !== collection) {
    const err = buildError(diagnostics);
    err.header = `package.json error`;
    err.messageText = `package.json "collection" property is required when generating a distribution and must be set to: ${collection}`;
  }
}


export function validateNamespace(config: d.Config, diagnostics: d.Diagnostic[]) {
  if (typeof config.namespace !== 'string' || config.fsNamespace === 'app') {
    const err = buildWarn(diagnostics);
    err.header = `config warning`;
    err.messageText = `When generating a distribution it is recommended to choose a unique namespace, which can be updated using the "namespace" config property within the stencil.config.js file.`;
  }
}


export function validatePackageFiles(config: d.Config, outputTarget: d.OutputTargetDist, diagnostics: d.Diagnostic[], pkgData: d.PackageJsonData) {
  if (pkgData.files) {
    const actualDistDir = normalizePath(config.sys.path.relative(config.rootDir, outputTarget.dir));

    const validPaths = [
      `${actualDistDir}`,
      `${actualDistDir}/`,
      `./${actualDistDir}`,
      `./${actualDistDir}/`
    ];

    const containsDistDir = (pkgData.files as string[])
            .some(userPath => validPaths.some(validPath => normalizePath(userPath) === validPath));

    if (!containsDistDir) {
      const err = buildError(diagnostics);
      err.header = `package.json error`;
      err.messageText = `package.json "files" array must contain the distribution directory "${actualDistDir}/" when generating a distribution.`;
    }
  }
}

