import * as path from 'path';
import * as d from '../../../declarations';
import { doNotExpectFiles, expectFiles } from '../../../testing/utils';
import { TestingCompiler } from '../../../testing/testing-compiler';
import { validateConfig } from '../../config/validate-config';


describe('distribution', () => {
  const root = path.resolve('/');

  let c: TestingCompiler;

  beforeEach(async () => {
    c = new TestingCompiler();
    await c.fs.writeFile(path.join(root, 'src', 'index.html'), `<cmp-a></cmp-a>`);
    await c.fs.commit();
  });


  it('should build app files, app global and component w/ modes', async () => {
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.tsx'), `
      @Component({
        tag: 'cmp-a',
        styleUrls: {
          md: 'cmp-a.md.css',
          ios: 'cmp-a.ios.css'
        }
      }) export class CmpA {}
      `);
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.md.css'), `cmp-a { color: green; }`);
    await c.fs.writeFile(path.join(root, 'src', 'cmp-a.ios.css'), `cmp-a { color: blue; }`);
    await c.fs.writeFile(path.join(root, 'src', 'global.ts'), `export const MyGlobal: any = {};`);
    await c.fs.writeFile(path.join(root, 'package.json'), `{
      "module": "dist/types/components.d.ts",
      "main": "dist/types/components.d.ts",
      "types": "dist/types/components.d.ts",
      "collection": "dist/collection/collection-manifest.json"
    }`);
    await c.fs.commit();

    c.config.outputTargets = [
      {
        type: 'dist'
      } as d.OutputTargetDist
    ];
    c.config._isValidated = false;
    validateConfig(c.config);

    c.config.namespace = 'TestApp';
    c.config.fsNamespace = 'testapp';
    c.config.globalScript = path.join(root, 'src', 'global.ts');
    c.config.buildAppCore = true;

    const r = await c.build();
    expect(r.diagnostics).toEqual([]);
    expect(r.entries).toHaveLength(1);
    expect(r.entries[0].components[0].tag).toContain('cmp-a');
    expect(r.transpileBuildCount).toBe(2);
    expect(r.bundleBuildCount).toBe(1);

    expectFiles(c.fs, [
      path.join(root, 'src', 'components.d.ts'),
      path.join(root, 'dist', 'collection', 'cmp-a.md.css'),
      path.join(root, 'dist', 'collection', 'cmp-a.ios.css'),
      path.join(root, 'dist', 'collection', 'cmp-a.js'),
      path.join(root, 'dist', 'collection', 'collection-manifest.json'),
      path.join(root, 'dist', 'collection', 'global.js'),
      path.join(root, 'dist', 'esm', 'es5', 'cmp-a.ios.js'),
      path.join(root, 'dist', 'esm', 'es5', 'cmp-a.md.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'array.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'dom.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'fetch.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'object.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'promise.js'),
      path.join(root, 'dist', 'esm', 'es5', 'polyfills', 'string.js'),
      path.join(root, 'dist', 'esm', 'es5', 'testapp.components.js'),
      path.join(root, 'dist', 'esm', 'es5', 'testapp.core.js'),
      path.join(root, 'dist', 'esm', 'es5', 'testapp.global.js'),
      path.join(root, 'dist', 'types', 'cmp-a.d.ts'),
      path.join(root, 'dist', 'types', 'components.d.ts'),
      path.join(root, 'dist', 'types', 'global.d.ts'),
      path.join(root, 'dist', 'types', 'stencil.core.d.ts')
    ]);

    doNotExpectFiles(c.fs, [
      path.join(root, 'www'),
      path.join(root, 'www', 'build'),
      path.join(root, 'www', 'build', 'app.js'),
      path.join(root, 'www', 'build', 'app', 'app.core.js'),
      path.join(root, 'www', 'build', 'app', 'app.global.js'),
      path.join(root, 'www', 'build', 'app', 'app.registry.json'),
      path.join(root, 'www', 'build', 'app', 'cmp-a.js'),
      path.join(root, 'www', 'build', 'testapp.js'),
      path.join(root, 'www', 'build', 'testapp', 'testapp.core.js'),
      path.join(root, 'www', 'build', 'testapp', 'testapp.global.js'),
      path.join(root, 'www', 'build', 'testapp', 'testapp.registry.json'),
      path.join(root, 'www', 'build', 'testapp', 'cmp-a.js'),
      path.join(root, 'www', 'index.html'),
      path.join(root, 'index.html')
    ]);

  });

});
