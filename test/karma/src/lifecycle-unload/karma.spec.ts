import { setupDomTests, flush } from '../util';


describe('lifecycle-unload', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/lifecycle-unload/index.html');
  });
  afterEach(tearDownDom);

  it('fire unload methods', async () => {
    if ('shadowRoot' in HTMLElement.prototype) {
      await testNativeShadowDom();

    } else {
      await testSlotPolyfill();
    }

  });

  async function testNativeShadowDom() {
    let main = app.querySelector('lifecycle-unload-a').shadowRoot.querySelector('main');
    expect(main.children[0].textContent.trim()).toBe('cmp-a - top');
    expect(main.children[1].textContent.trim()).toBe('cmp-a - middle');
    expect(main.children[2].textContent.trim()).toBe('cmp-a - bottom');
    expect(main.children[1].shadowRoot.children[0].textContent.trim()).toBe('cmp-b - top');
    expect(main.children[1].shadowRoot.children[1].textContent.trim()).toBe('');
    expect(main.children[1].shadowRoot.children[2].textContent.trim()).toBe('cmp-b - bottom');

    let unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children.length).toBe(0);

    const button = app.querySelector('button');
    button.click();
    await flush(app);

    const cmpA = app.querySelector('lifecycle-unload-a');
    expect(cmpA).toBe(null);

    unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children[0].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[1].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children.length).toBe(2);

    button.click();
    await flush(app);

    main = app.querySelector('lifecycle-unload-a').shadowRoot.querySelector('main');
    expect(main.children[0].textContent.trim()).toBe('cmp-a - top');
    expect(main.children[1].textContent.trim()).toBe('cmp-a - middle');
    expect(main.children[2].textContent.trim()).toBe('cmp-a - bottom');
    expect(main.children[1].shadowRoot.children[0].textContent.trim()).toBe('cmp-b - top');
    expect(main.children[1].shadowRoot.children[1].textContent.trim()).toBe('');
    expect(main.children[1].shadowRoot.children[2].textContent.trim()).toBe('cmp-b - bottom');

    button.click();
    await flush(app);

    unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children[0].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[1].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children[2].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[3].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children.length).toBe(4);
  }

  async function testSlotPolyfill() {
    let main = app.querySelector('lifecycle-unload-a main');
    expect(main.children[0].textContent.trim()).toBe('cmp-a - top');
    expect(main.children[1].children[0].textContent.trim()).toBe('cmp-b - top');
    expect(main.children[1].children[1].textContent.trim()).toBe('cmp-a - middle');
    expect(main.children[1].children[2].textContent.trim()).toBe('cmp-b - bottom');
    expect(main.children[2].textContent.trim()).toBe('cmp-a - bottom');

    let unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children.length).toBe(0);

    const button = app.querySelector('button');
    button.click();
    await flush(app);

    const cmpA = app.querySelector('lifecycle-unload-a');
    expect(cmpA).toBe(null);

    unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children[0].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[1].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children.length).toBe(2);

    button.click();
    await flush(app);

    main = app.querySelector('lifecycle-unload-a main');
    expect(main.children[0].textContent.trim()).toBe('cmp-a - top');
    expect(main.children[1].children[0].textContent.trim()).toBe('cmp-b - top');
    expect(main.children[1].children[1].textContent.trim()).toBe('cmp-a - middle');
    expect(main.children[1].children[2].textContent.trim()).toBe('cmp-b - bottom');
    expect(main.children[2].textContent.trim()).toBe('cmp-a - bottom');

    button.click();
    await flush(app);

    unload = app.querySelector('#lifecycle-unload-results');
    expect(unload.children[0].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[1].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children[2].textContent.trim()).toBe('cmp-a unload');
    expect(unload.children[3].textContent.trim()).toBe('cmp-b unload');
    expect(unload.children.length).toBe(4);
  }

});
