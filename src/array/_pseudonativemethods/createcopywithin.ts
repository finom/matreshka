import syncFields from '../_syncfields.js';
import apply from '../../_helpers/apply.js';
import reportModified from '../_reportmodified.js';
import assign from '../../_helpers/assign.js';
import type { ArrayEventOptions, MatreshkaArrayInstance } from '../types.js';

export default function createCopyWithin(
  hasOptions: boolean
): (this: MatreshkaArrayInstance, ...args: any[]) => MatreshkaArrayInstance {
  return function copyWithin(this: MatreshkaArrayInstance): MatreshkaArrayInstance {
    syncFields(this);
    // +hasOptions is converted to 0 or 1 depending on its value (false/true)
    const argsLength = arguments.length - +hasOptions;
    const args: any[] = Array(argsLength);
    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;

    for (let i = 0; i < argsLength; i++) {
      args[i] = arguments[i];
    }

    apply(Array.prototype.copyWithin, this, args);

    const eventOptions: ArrayEventOptions = {
      method: 'copyWithin',
      self: this,
      added: [],
      removed: []
    };

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
