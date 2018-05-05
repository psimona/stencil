

export class MyStencilElement {

  static get is() {
    return 'stencil-element';
  }

  static getModule(opts) {
    if (opts.scoped) {
      if (opts.mode === 'ios') {
        return import('./stencil-element.ios.sc.js');
      }
      return import('./stencil-element.md.sc.js');
    }

    if (opts.mode === 'ios') {
      return import('./stencil-element.ios.js');
    }
    return import('./stencil-element.md.js');
  }
}
