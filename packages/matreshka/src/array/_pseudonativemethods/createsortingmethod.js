import syncFields from '../_syncfields';
import reportModified from '../_reportmodified';
import assign from '../../_helpers/assign';

// creates sorting method and returns it (sort, reverse, sort_, reverse_)
export default function createSortingMethod(name, hasOptions) {
  return function pseudoNativeMethod(sortCallback) {
    syncFields(this);

    if (this.length < 2) return this;

    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;
    const method = Array.prototype[name];

    const eventOptions = {
      method: name,
      self: this,
      added: [],
      removed: []
    };

    // call original method
    if (name === 'sort' && typeof sortCallback === 'function') {
      method.call(this, sortCallback);
    } else {
      method.call(this);
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
