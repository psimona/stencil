import * as d from '../../declarations';
import { createPlatformMain } from '../platform-main';
import { ensureFeatures } from './ensure-features';
import { fillCmpMetaFromConstructor } from '../../util/cmp-meta';


const pltMap: { [namespace: string]: d.PlatformApi } = {};
declare const appGlobal: Function;


export function customElementsDefine(win: Window, cmpConstructor: d.ComponentConstructor | d.ComponentConstructor[], opts: CustomElementsDefineOptions = {}) {

  const namespace = opts.namespace || 'App';
  if (!pltMap[namespace]) {
    const Context: d.CoreContext = {};
    const resourcesUrl = opts.resourcesUrl || './';
    const hydratedCssClass = opts.hydratedCssClass || 'hydrated';

    appGlobal(namespace, Context, win, win.document, resourcesUrl, hydratedCssClass);

    // create a platform for this namespace
    pltMap[namespace] = createPlatformMain(
      namespace,
      Context,
      win,
      win.document,
      resourcesUrl,
      hydratedCssClass
    );
  }

  ensureFeatures(win, () => {
    // polyfills have been applied if need be

    const cmpArr = Array.isArray(cmpConstructor) ? cmpConstructor : [cmpConstructor];
    cmpArr.forEach(cmpConstructor => {
      let HostElementConstructor: any;

      if (isNative(win.customElements.define)) {
        // native custom elements supported
        HostElementConstructor = class extends (win as any).HTMLElement {};

      } else {
        // using polyfilled custom elements
        HostElementConstructor = function(self: any) {
          return (win as any).HTMLElement.call(this, self);
        };

        HostElementConstructor.prototype = Object.create(
          (win as any).HTMLElement.prototype,
          { constructor: { value: HostElementConstructor, configurable: true } }
        );
      }

      // convert the static constructor data to cmp metadata
      // define the component as a custom element
      pltMap[namespace].defineComponent(
        fillCmpMetaFromConstructor(cmpConstructor, {}),
        HostElementConstructor
      );
    });
  });
}


export interface CustomElementsDefineOptions {
  hydratedCssClass?: string;
  namespace?: string;
  resourcesUrl?: string;
}


function isNative(fn: Function) {
  return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}
