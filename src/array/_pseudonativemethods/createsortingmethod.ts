import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import assign from '../../_helpers/assign.js';
import type { ArrayEventOptions, MatreshkaArrayInstance } from '../types.js';

// creates sorting method and returns it (sort, reverse, sort_, reverse_)
export default function createSortingMethod(
  name: 'sort' | 'reverse',
  hasOptions: boolean
): (this: MatreshkaArrayInstance, sortCallback?: any, ...args: any[]) => MatreshkaArrayInstance {
  return function pseudoNativeMethod(this: MatreshkaArrayInstance, sortCallback?: any): MatreshkaArrayInstance {
    syncFields(this);

    if (this.length < 2) return this;

    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;
    const method: (this: any[], compareFn?: (a: any, b: any) => number) => any[] = Array.prototype[name];

    const eventOptions: ArrayEventOptions = {
      method: name,
      self: this,
      added: [],
      removed: []
    };

    // call original method
    if (name === 'sort' && typeof sortCallback === 'function') {
      method.call(this as unknown as any[], sortCallback);
    } else {
      method.call(this as unknown as any[]);
    }

    // extend event options by custom event options if they are given
    if (hasOptions) {
      if (givenEventOptions && typeof givenEventOptions === 'object') {
        assign(eventOptions, givenEventOptions);
      }
    }

    reportModified(this, eventOptions);

    return this;
  };
}
