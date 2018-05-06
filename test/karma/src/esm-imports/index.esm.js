import { customElementsDefine } from '../../test-dist/index.esm';
import { MyEsmComponent } from './esm-host';

customElementsDefine(window, MyEsmComponent);