import syncFields from '../_syncfields';
import reportModified from '../_reportmodified';
import toMatreshkaArray from '../_tomatreshkaarray';
import apply from '../../_helpers/apply';
import assign from '../../_helpers/assign';
import toAbsoluteIndex from '../_toabsoluteindex';
import { spliceStart } from '../_processrendering/processspliceadd';

// creates splice or splice_ method and returns it
// TODO: Improve readability of createSplice function
export default function createSplice(hasOptions) {
  return function pseudoNativeMethod() {
    const { itemMediator } = syncFields(this);
    const functionArguments = arguments;
    const argsLength = functionArguments.length - +hasOptions;
    const args = Array(argsLength);
    const givenEventOptions = hasOptions ? functionArguments[functionArguments.length - 1] : null;
    const useMediator = typeof itemMediator === 'function' && !givenEventOptions?.skipItemMediator;
    const added = [];
    const { length } = this;
    const start = toAbsoluteIndex(functionArguments[0], length);

    // convert arguments to array and call item mediator on every new item if it's possible
    for (let i = 0; i < argsLength; i++) {
      const arg = functionArguments[i];

      if (i < 2) {
        args[i] = arg;
      } else {
        args[i] = useMediator ? itemMediator(arg, start + (i - 2)) : arg;
        added[i - 2] = args[i];
      }
    }

    // call original method
    // TODO: Change array manually in splice method for better performance
    const returns = apply(Array.prototype.splice, this, args);
    // removed items mean returned items
    const removed = returns;

    // if something is added or removed
    if (added.length || removed.length) {
      const eventOptions = {
        added,
        removed,
        method: 'splice',
        self: this,
        [spliceStart]: start
      };

      // extend event options by custom event options if they are given
      if (hasOptions) {
        if (givenEventOptions && typeof givenEventOptions === 'object') {
          assign(eventOptions, givenEventOptions);
        }
      }

      reportModified(this, eventOptions);
    }

    return toMatreshkaArray(returns);
  };
}
