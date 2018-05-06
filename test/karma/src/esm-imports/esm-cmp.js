import { h } from '../../test-dist/index.esm';

export class MyEsmComponent {

  static get is() {
    return 'esm-import';
  }

  render() {
    return h('div', null, 'esm-cmp');
  }
}
