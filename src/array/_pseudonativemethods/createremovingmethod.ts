import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import assign from '../../_helpers/assign.js';
import type { ArrayEventOptions, ArrayMethodOptions, MatreshkaArrayInstance } from '../types.js';

// creates removing method and returns it (pop, shift, pop_, shift_)
export default function createRemovingMethod(
  name: 'pop' | 'shift',
  hasOptions: boolean
): (this: MatreshkaArrayInstance, givenEventOptions?: ArrayMethodOptions) => any {
  return function pseudoNativeMethod(this: MatreshkaArrayInstance, givenEventOptions?: ArrayMethodOptions): any {
    syncFields(this);

    if (!this.length) {
      return undefined;
    }

    // call original method
    const returns = Array.prototype[name].call(this as unknown as any[]);
    const eventOptions: ArrayEventOptions = {
      method: name,
      self: this,
      added: [],
      removed: [returns]
    };

    // extend event options by custom event options if they are given
    if (hasOptions) {
      if (givenEventOptions && typeof givenEventOptions === 'object') {
        assign(eventOptions, givenEventOptions);
      }
    }

    reportModified(this, eventOptions);

    return returns;
  };
}
