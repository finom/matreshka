import syncFields from '../_syncfields';
import apply from '../../_helpers/apply';
import reportModified from '../_reportmodified';
import assign from '../../_helpers/assign';

export default function createCopyWithin(hasOptions) {
  return function copyWithin() {
    syncFields(this);
    // +hasOptions is converted to 0 or 1 depending on its value (false/true)
    const argsLength = arguments.length - +hasOptions;
    const args = Array(argsLength);
    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;

    for (let i = 0; i < argsLength; i++) {
      args[i] = arguments[i];
    }

    apply(Array.prototype.copyWithin, this, args);

    const eventOptions = {
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
