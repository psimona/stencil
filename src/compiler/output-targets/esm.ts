import * as d from '../../declarations';
import { dashToPascalCase } from '../../util/helpers';
import { ENCAPSULATION } from '../../util/constants';
import { generatePreamble } from '../util';
import { getComponentsEsmBuildPath } from '../../compiler/app/app-file-naming';
import { formatComponentConstructorListeners, formatComponentConstructorProperties, formatConstructorEncapsulation } from '../../util/data-serialize';


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
    componentClassList.push(cmpMeta.componentClass);

    const data = generateConstructorData(cmpMeta);
    fileContents.push(`var ${cmpMeta.componentClass} = ${data};`);
  });

  fileContents.push(
    generateExports(componentClassList)
  );

  const componentsEsmFilePath = getComponentsEsmBuildPath(config, outputTarget, 'es5');

  await compilerCtx.fs.writeFile(componentsEsmFilePath, fileContents.join('\n\n'));
}


function generateConstructorData(cmpMeta: d.ComponentMeta) {
  const c: string[] = [];
  const isScoped = cmpMeta.encapsulation === ENCAPSULATION.ScopedCss;

  c.push(`{`);
  c.push(`  is: '${cmpMeta.tagNameMeta}',`);

  const encapsulation = formatConstructorEncapsulation(cmpMeta.encapsulation);
  if (encapsulation) {
    c.push(`  encapsulation: '${encapsulation}',`);
  }

  const properties = formatComponentConstructorProperties(cmpMeta.membersMeta, true, true);
  if (properties) {
    c.push(`  properties: ${properties},`);
  }

  const listeners = formatComponentConstructorListeners(cmpMeta.listenersMeta, true);
  if (listeners) {
    c.push(`  listeners: ${listeners},`);
  }

  c.push(`  getModule: function(opts) {${getModule(cmpMeta, isScoped)}\n  }`);
  c.push(`}`);

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
