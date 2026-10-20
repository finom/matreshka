import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import assign from '../../_helpers/assign.js';
import withLengthOptions from '../_withlengthoptions.js';
import checkAddedItems from '../_processrendering/checkbeforechange.js';
import type { ArrayDef, ArrayEventOptions, MatreshkaArrayInstance } from '../types.js';

// creates methods: push, unshift, push_, unshift_
export default function createAddingMethod(
  name: 'push' | 'unshift',
  hasOptions: boolean
): (this: MatreshkaArrayInstance, ...args: any[]) => number {
  return function pseudoNativeMethod(this: MatreshkaArrayInstance): number {
    const selfDef: ArrayDef = syncFields(this);
    const { itemMediator } = selfDef;
    // +hasOptions is converted to 0 or 1 depending on its value (false/true)
    const argsLength = Math.max(arguments.length - +hasOptions, 0);
    const args: any[] = Array(argsLength);
    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;
    const useMediator = typeof itemMediator === 'function' && !givenEventOptions?.skipItemMediator;
    const isPush = name === 'push';
    let { length } = this;

    // if no arguments are passed
    if (!argsLength) {
      return length;
    }

    // convert arguments to array and call item mediator on every item if it's possible
    for (let i = 0; i < argsLength; i++) {
      const arg = arguments[i];
      if (useMediator) {
        const index = isPush ? i + length : i;
        args[i] = itemMediator(arg, index);
      } else {
        args[i] = arg;
      }
    }

    checkAddedItems(this, selfDef, args, givenEventOptions);

    if (isPush) {
      // insert new items to the end of array
      for (let i = 0; i < argsLength; i++) {
        this[length + i] = args[i];
      }
    } else {
      // move current items to new indexes; a hole stays a hole, as in the native method
      for (let i = length - 1; i >= 0; i--) {
        if (i in this) {
          this[argsLength + i] = this[i];
        } else {
          delete this[argsLength + i];
        }
      }
      // insert new items to the begin of array
      for (let i = 0; i < argsLength; i++) {
        this[i] = args[i];
      }
    }

    // update length
    length += argsLength;
    withLengthOptions(this, givenEventOptions, () => {
      this.length = length;
    });

    const eventOptions: ArrayEventOptions = {
      method: name,
      self: this,
      added: args,
      removed: []
    };

    // extend event options by custom event options if they are given
    if (hasOptions) {
      if (givenEventOptions && typeof givenEventOptions === 'object') {
        assign(eventOptions, givenEventOptions);
      }
    }

    reportModified(this, eventOptions);

    return length;
  };
}
