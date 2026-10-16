import syncFields from '../_syncfields';
import reportModified from '../_reportmodified';
import assign from '../../_helpers/assign';
import toAbsoluteIndex from '../_toabsoluteindex';

export default function createFill(hasOptions) {
  return function fill(value, start, end) {
    const { itemMediator } = syncFields(this);
    const argsLength = arguments.length - +hasOptions;
    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;
    const useMediator = typeof itemMediator === 'function' && !givenEventOptions?.skipItemMediator;
    const { length } = this;
    const from = toAbsoluteIndex(argsLength > 1 ? start : undefined, length);
    const to = toAbsoluteIndex(argsLength > 2 ? end : undefined, length, length);
    const added = [];
    const removed = [];

    for (let i = from; i < to; i++) {
      const item = useMediator ? itemMediator(value, i) : value;

      removed.push(this[i]);
      added.push(item);
      this[i] = item;
    }

    const eventOptions = {
      method: 'fill',
      self: this,
      added,
      removed
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
