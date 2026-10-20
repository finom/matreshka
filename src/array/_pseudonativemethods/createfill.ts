import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import assign from '../../_helpers/assign.js';
import toAbsoluteIndex from '../_toabsoluteindex.js';
import { checkCompatRenderer } from '../_processrendering/checkbeforechange.js';
import type { ArrayDef, ArrayEventOptions, MatreshkaArrayInstance } from '../types.js';

export default function createFill(
  hasOptions: boolean
): (this: MatreshkaArrayInstance, value: any, start?: any, end?: any) => MatreshkaArrayInstance {
  return function fill(this: MatreshkaArrayInstance, value: any, start?: any, end?: any): MatreshkaArrayInstance {
    const { itemMediator }: ArrayDef = syncFields(this);
    const argsLength = arguments.length - +hasOptions;
    const givenEventOptions = hasOptions ? arguments[arguments.length - 1] : null;
    const useMediator = typeof itemMediator === 'function' && !givenEventOptions?.skipItemMediator;
    const { length } = this;
    const from = toAbsoluteIndex(argsLength > 1 ? start : undefined, length);
    const to = toAbsoluteIndex(argsLength > 2 ? end : undefined, length, length);
    const added: any[] = [];
    const removed: any[] = [];

    // an empty range changes nothing, so nothing is reported
    if (from >= to) {
      return this;
    }

    checkCompatRenderer(this, 'fill', givenEventOptions);

    for (let i = from; i < to; i++) {
      const item = useMediator ? itemMediator(value, i) : value;

      removed.push(this[i]);
      added.push(item);
      this[i] = item;
    }

    const eventOptions: ArrayEventOptions = {
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
