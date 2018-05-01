import * as d from '../declarations';
import { generatePreamble } from './util';
import { transpileCoreBuild } from './transpile/core-build';
import { minifyCore } from '../compiler/app/build-core-content';


/**
 * Same minifier which the stencil core build uses. This
 * minifier does some heavy property renaming and has
 * specific settings for ES5 and ESM.
 */
export async function minifyCoreBuild(jsText: string, coreBuild: d.BuildConditionals, opts: MinifyBuildOptions = {}) {
  const nodeSys = require('../sys/node/index.js');

  const config: d.Config = {
    logLevel: opts.debug ? 'debug' : 'info',
    minifyJs: true,
    sys: new nodeSys.NodeSystem()
  };

  const transpileResults = await transpileCoreBuild(null, coreBuild, jsText);

  if (transpileResults.diagnostics && transpileResults.diagnostics.length) {
    console.error(transpileResults.diagnostics);
    return null;
  }

  jsText = transpileResults.code;

  return minifyCore(config, null, opts.sourceTarget as any, jsText);
}


export interface MinifyBuildOptions {
  debug?: boolean;
  sourceTarget?: 'esm' | 'es5';
}


/**
 * Interal minifier, not exposed publicly.
 */
export async function minifyJs(config: d.Config, compilerCtx: d.CompilerCtx, jsText: string, sourceTarget: d.SourceTarget, preamble: boolean) {
  const opts: any = { output: {}, compress: {}, mangle: true };

  if (sourceTarget === 'es5') {
    opts.ecma = 5;
    opts.output.ecma = 5;
    opts.compress.ecma = 5;
    opts.compress.arrows = false;
    opts.output.beautify = false;

  } else {
    opts.ecma = 6;
    opts.output.ecma = 6;
    opts.compress.ecma = 6;
    opts.toplevel = true;
    opts.compress.arrows = true;
    opts.output.beautify = false;
  }

  if (config.logLevel === 'debug') {
    opts.mangle = {};
    opts.mangle.keep_fnames = true;
    opts.compress.drop_console = false;
    opts.compress.drop_debugger = false;
    opts.output.beautify = true;
    opts.output.bracketize = true;
    opts.output.indent_level = 2;
    opts.output.comments = 'all';
    opts.output.preserve_line = true;
  } else {
    opts.compress.pure_funcs = ['assert', 'console.debug'];
  }

  opts.compress.passes = 2;

  if (preamble) {
    opts.output.preamble = generatePreamble(config);
  }

  let cacheKey: string;

  if (compilerCtx) {
    cacheKey = compilerCtx.cache.createKey('minifyJs', opts, jsText);
    const cachedContent = await compilerCtx.cache.get(cacheKey);
    if (cachedContent != null) {
      return {
        output: cachedContent,
        diagnostics: []
      };
    }
  }

  const r = config.sys.minifyJs(jsText, opts);

  if (compilerCtx) {
    if (r && r.diagnostics.length === 0 && typeof r.output === 'string') {
      await compilerCtx.cache.put(cacheKey, r.output);
    }
  }

  return r;
}
