import { setupDomTests, flush } from '../util';


describe('slot-dynamic-wrapper', () => {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/slot-dynamic-wrapper/index.html');
  });
  afterEach(tearDownDom);


  it('renders', async () => {
    let result: HTMLElement;

    result = app.querySelector('.results1 section h1');
    expect(result.textContent.trim()).toBe('parent text');

    let button = app.querySelector('button');
    button.click();
    await flush(app);

    result = app.querySelector('.results1 section h1');
    expect(result).toBe(null);

    result = app.querySelector('.results1 article h1');
    expect(result.textContent.trim()).toBe('parent text');

    button.click();
    await flush(app);

    result = app.querySelector('.results1 section h1');
    expect(result.textContent.trim()).toBe('parent text');

    result = app.querySelector('.results1 article h1');
    expect(result).toBe(null);
  });

});
