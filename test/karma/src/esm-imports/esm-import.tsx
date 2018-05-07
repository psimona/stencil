import { Component } from '../../../../dist/index';


@Component({
  tag: 'esm-import'
})
export class MyEsmComponent {

  render() {
    return h('div', null, 'esm-import!!');
  }
}
