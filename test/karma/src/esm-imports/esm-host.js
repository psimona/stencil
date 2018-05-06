

export class MyEsmComponent {

  static get is() {
    return 'esm-import';
  }

  static getModule() {
    return import('./esm-cmp.js').then(m => m.MyEsmComponent);
  }
}
