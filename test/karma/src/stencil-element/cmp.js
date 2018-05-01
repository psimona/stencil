import { ensureFeatures, h, StencilElement } from '../../../../dist/index';


export class MyStencilElement extends StencilElement() {

  static get is() {
    return 'stencil-element';
  }

  render() {
    return (
      h('div', { class: 'stencil-class' }, 'stencil element!')
    );
  }
}

ensureFeatures(window, () => {
  window.customElements.define(MyStencilElement.is, MyStencilElement);
});