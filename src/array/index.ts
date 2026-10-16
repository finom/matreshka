import Class from '../class.js';
import Matreshka from '../matreshka/index.js';
import instanceMembers from './_prototype.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import initMK from '../_core/init.js';
import staticMembers from './_staticmembers.js';
import type { MatreshkaArrayConstructor, MatreshkaArrayInstance } from './types.js';

instanceMembers.extends = Matreshka;

instanceMembers.constructor = function MatreshkaArray(
  this: MatreshkaArrayInstance,
  length?: number
): MatreshkaArrayInstance {
  if (!(this instanceof MatreshkaArray)) {
    throw matreshkaError('common:call_class');
  }

  initMK(this);

  // repeat the same logic as for native Array
  if (arguments.length === 1 && typeof length === 'number') {
    if (!Number.isInteger(length) || length < 0 || length > 2 ** 32 - 1) {
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
