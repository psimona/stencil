import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { ENCAPSULATION } from '../../util/constants';
import { generatePreamble } from '../util';
import { getComponentsEsmBuildPath } from '../../compiler/app/app-file-naming';


export async function generateEsmHosts(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTarget) {
  if (outputTarget.type !== 'dist') {
    return;
  }

  await Promise.all([
    generateEsmEs5(config, compilerCtx, cmpRegistry, outputTarget)
  ]);
}


async function generateEsmEs5(config: d.Config, compilerCtx: d.CompilerCtx, cmpRegistry: d.ComponentRegistry, outputTarget: d.OutputTarget) {
  const componentClassList: string[] = [];

  const fileContents: string[] = [
    generatePreamble(config, `${config.namespace}: Host Elements, ES5`)
  ];

  Object.keys(cmpRegistry).sort().forEach(tagName => {
    const cmpMeta = cmpRegistry[tagName];
    const isScoped = cmpMeta.encapsulation === ENCAPSULATION.ScopedCss;
    componentClassList.push(cmpMeta.componentClass);

    fileContents.push(generateEsmHostClassEs5(cmpMeta, isScoped));
  });

  fileContents.push(
    generateExports(componentClassList)
  );

  const componentsEsmFilePath = getComponentsEsmBuildPath(config, outputTarget, 'es5');

  await compilerCtx.fs.writeFile(componentsEsmFilePath, fileContents.join('\n\n'));
}


function generateEsmHostClassEs5(cmpMeta: d.ComponentMeta, isScoped: boolean) {
  const c: string[] = [];

  c.push(`var ${cmpMeta.componentClass} = /** @class **/ (function() {`);
  c.push(`  function ${cmpMeta.componentClass}() {}`);
  c.push(`  ${cmpMeta.componentClass}.is = '${cmpMeta.tagNameMeta}';`);



  c.push(`  ${cmpMeta.componentClass}.getModule = function(opts) {${getModule(cmpMeta, isScoped)}\n  };`);
  c.push(`  return ${cmpMeta.componentClass};`);
  c.push(`})();`);

  return c.join('\n');
}


function getModule(cmpMeta: d.ComponentMeta, isScoped: boolean) {
  return Object.keys(cmpMeta.bundleIds).map(styleMode => {
    const fileNameEs5 = getModuleFileName(cmpMeta, styleMode);
    const pascalCasedClassName = dashToPascalCase(cmpMeta.tagNameMeta);
    return getModuleImport(styleMode, fileNameEs5, isScoped, pascalCasedClassName);
  }).join('\n    ');
}


function getModuleFileName(cmpMeta: d.ComponentMeta, styleMode: string) {
  const fileName = (typeof cmpMeta.bundleIds !== 'string') ? cmpMeta.bundleIds[styleMode] : cmpMeta.bundleIds;
  return './' + fileName;
}


function getModuleImport(styleMode: string, fileName: string, isScoped: boolean, pascalCasedClassName: string) {
  if (styleMode === '$' && isScoped) {
    return `
    if (opts.scoped) {
      return import('${fileName}.sc.js').then(function(m) { return m.${pascalCasedClassName}; });
    }
    return import('${fileName}.js').then(function(m) { return m.${pascalCasedClassName}; });`;
  }

  if (styleMode === '$') {
    return `
    return import('${fileName}.js').then(function(m) { return m.${pascalCasedClassName}; });`;
  }

  if (isScoped) {
  return `
    if (opts.mode === '${styleMode}' && opts.scoped) {
      return import('${fileName}.sc.js').then(function(m) { return m.${pascalCasedClassName}; });
    } else if (opts.mode === '${styleMode}') {
      return import('${fileName}.js').then(function(m) { return m.${pascalCasedClassName}; });
    }`;
  }

  return `
    if (opts.mode === '${styleMode}') {
      return import('${fileName}.js').then(function(m) { return m.${pascalCasedClassName}; });
    }`;
}


function generateExports(componentClassList: string[]) {
  return `export {\n  ${componentClassList.sort().join(',\n  ')}\n};`;
}
