import { h, StencilElement } from '../../../../dist/index';


export class MyStencilElement extends StencilElement() {

  static get is() {
    return 'stencil-element';
  }

  render() {
    return (
      <main>
        stencil-element
      </main>
    );
  }
}
