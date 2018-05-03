

export function ensureFeatures(window: Window, cb?: () => void) {
  if (window.customElements && window.customElements.define) {
    cb();

  } else {


    __import('../../../polyfills/index.esm.js').then((applyPolyfills: (window: Window) => void) => {
      applyPolyfills(window);
      cb();
    });
  }
}

declare const __import: Function;
