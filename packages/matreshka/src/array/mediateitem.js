import initMK from '../_core/init';
import reportModified from './_reportmodified';
import processRendering from './_processrendering';

// creates item mediator
function createItemMediator({ arr, mediator }) {
  return function itemMediator(value, index) {
    // args: value, index, array itself
    return mediator.call(arr, value, index, arr);
  };
}

// defines a "type" of every array item
export default function mediateItem(mediator) {
  const def = initMK(this);
  const { length } = this;
  const added = [];
  const removed = [];

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
    const eventOptions = {
      method: 'recreate',
      self: this,
      added,
      removed
    };
    const { renderIfPossible = true } = this;

    // no array events are fired, as before, but converted items are rendered as usual (with render hooks)
    reportModified(this, { ...eventOptions, silent: true, dontRender: true });

    if (renderIfPossible) {
      processRendering({ self: this, eventOptions });
    }
  }

  return this;
}
