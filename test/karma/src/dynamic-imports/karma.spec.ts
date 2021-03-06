import { setupDomTests } from '../util';

describe('tag-names', () => {
  const { setupDom, tearDownDom, flush } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/dynamic-imports/index.html');
  });
  afterEach(tearDownDom);

  it('should load content from dynamic import', async () => {
    const dynamicImport = app.querySelector('dynamic-import');
    expect(dynamicImport.textContent.trim()).toBe('1 hello1 world1');

    (dynamicImport as any).update();
    await flush(app);
    expect(dynamicImport.textContent.trim()).toBe('2 hello2 world2');
  });

});
