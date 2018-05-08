import * as d from '../../declarations';
import { generatePreamble } from '../util';
import { getDistCjsIndexPath } from '../app/app-file-naming';


export async function generateCommonJsIndex(config: d.Config, compilerCtx: d.CompilerCtx, outputTarget: d.OutputTargetDist) {
  const cjs: string[] = [
    generatePreamble(config, `${config.namespace}: CommonJS Main`)
  ];

  const distIndexCjsPath = getDistCjsIndexPath(config, outputTarget);

  await compilerCtx.fs.writeFile(distIndexCjsPath, cjs.join('\n'));
}
