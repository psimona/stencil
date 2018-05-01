import * as d from '../../declarations';
import { createPlatformMain } from '../platform-main';
import { fillCmpMetaFromConstructor } from '../../util/cmp-meta';
export { h } from '../../renderer/vdom/h';


let plt: d.PlatformApi;


export function StencilElement(superClass?: d.StencilElementSuperClass, opts: d.StencilElementMixinOptions = {}) {
  let win: any;

  if (!plt) {
    const namespace = opts['namespace'] || `App`;
    win = opts['window'] || window;
    const resourcesUrl = opts['resourcesUrl'] || './';
    const hydratedCssClass = opts['hydratedCssClass'] || 'hydrated';

    plt = createPlatformMain(namespace, {}, win, win['document'], resourcesUrl, hydratedCssClass);
  }

  superClass = superClass || win['HTMLElement'] || new Object();


  class RendererMixin extends superClass {

    constructor() {
      super();
      plt.defineComponent(fillCmpMetaFromConstructor(this, {}), this);
    }

  }

  return RendererMixin as any;
}


export function ensureFeatures(window: Window, cb?: () => void) {
  let promise: Promise<Window>;

  if (!cb) {
    promise = new Promise(resolve => {
      cb = resolve;
    });
  }

  if (window.customElements && window.customElements.define) {
    cb();

  } else {
    __import('../../../polyfills/custom-element.js').then(() => {
      cb();
    });
  }

  return promise;
}


declare const __import: Function;
