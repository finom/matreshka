import assign from '../_helpers/assign.js';
import initMK from '../_core/init.js';
import reportModified from './_reportmodified.js';
import processRendering from './_processrendering/index.js';
import type {
  ArrayDef,
  ArrayEventOptions,
  ItemMediator,
  ItemMediatorCallback,
  MatreshkaArrayInstance
} from './types.js';

// creates item mediator
function createItemMediator({
  arr,
  mediator
}: {
  arr: MatreshkaArrayInstance;
  mediator: ItemMediatorCallback;
}): ItemMediator {
  return function itemMediator(value: any, index: number): any {
    // args: value, index, array itself
    return mediator.call(arr, value, index, arr);
  };
}

// defines a "type" of every array item
export default function mediateItem(
  this: MatreshkaArrayInstance,
  mediator: ItemMediatorCallback
): MatreshkaArrayInstance {
  const def: ArrayDef = initMK(this);
  const { length } = this;
  const added: any[] = [];
  const removed: any[] = [];

  // store itemMediator in object definition
  const itemMediator = createItemMediator({
    arr: this,
    mediator
  });
  def.itemMediator = itemMediator;

  // convert existing items
  for (let i = 0; i < length; i++) {
    const item = this[i];
    const mediated = itemMediator(item, i);

    if (mediated !== item) {
      removed.push(item);
      added.push(mediated);
    }

    this[i] = mediated;
  }

  if (added.length) {
    const eventOptions: ArrayEventOptions = {
      method: 'recreate',
      self: this,
      added,
      removed
    };
    const { renderIfPossible = true } = this;

    // no array events are fired, as before, but converted items are rendered as usual (with render hooks)
    reportModified(this, assign({}, eventOptions, { silent: true, dontRender: true }));

    if (renderIfPossible) {
      processRendering({ self: this, eventOptions });
    }
  }

  return this;
}
