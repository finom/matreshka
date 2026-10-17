import Class from '../class.js';
import Matreshka from '../matreshka/index.js';
import instanceMembers from './_prototype.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import initMK from '../_core/init.js';
import staticMembers from './_staticmembers.js';
import modelCall from './_modelcall.js';
import type { MatreshkaArrayConstructor, MatreshkaArrayInstance } from './types.js';
import isInteger from '../_helpers/isinteger.js';

instanceMembers.extends = Matreshka;

instanceMembers.constructor = function MatreshkaArray(
  this: MatreshkaArrayInstance,
  length?: number
): MatreshkaArrayInstance {
  if (!(this instanceof MatreshkaArray)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);

  const call = modelCall.args;

  if (call && arguments.length === 3 && call.every((arg, i) => arg === arguments[i])) {
    // a Model of another array: the item's data are the items
    modelCall.args = null;
    const [data] = call;
    const items =
      data && typeof data === 'object' && typeof data.length === 'number' ? data : data == null ? [] : [data];
    this.recreate(items, {
      silent: true,
      dontRender: true
    });
  } else if (arguments.length === 1 && typeof length === 'number') {
    // repeat the same logic as for native Array
    if (!isInteger(length) || length < 0 || length > 2 ** 32 - 1) {
      throw new RangeError('Invalid array length');
    }

    this.length = length;
  } else if (arguments.length) {
    this.recreate(arguments, {
      silent: true,
      dontRender: true
    });
  }

  // return is used to make possible to chain super() calls
  return this;
};

// the value is what Class builds; the type describes it
const MatreshkaArray = Class(instanceMembers, staticMembers) as MatreshkaArrayConstructor;
type MatreshkaArray<Item = any> = MatreshkaArrayInstance<Item>;

export default MatreshkaArray;
export type {
  ArrayMethodOptions,
  ItemEventOptions,
  ItemMediatorCallback,
  ItemRenderer,
  MatreshkaArrayConstructor,
  MatreshkaArrayInstance,
  ModelConstructor
} from './types.js';
