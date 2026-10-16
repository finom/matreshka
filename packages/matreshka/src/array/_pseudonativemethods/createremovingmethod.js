import syncFields from '../_syncfields';
import reportModified from '../_reportmodified';
import assign from '../../_helpers/assign';

// creates removing method and returns it (pop, shift, pop_, shift_)
export default function createRemovingMethod(name, hasOptions) {
  return function pseudoNativeMethod(givenEventOptions) {
    syncFields(this);

    if (!this.length) {
      return undefined;
    }

    // call original method
    const returns = Array.prototype[name].call(this);
    const eventOptions = {
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
