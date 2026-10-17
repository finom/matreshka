import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import updateTracked from './_updatetracked.js';
import itemsNotIn from '../_diffitems.js';
import withLengthOptions from '../_withlengthoptions.js';
import type { ArrayMethodOptions, MatreshkaArrayInstance } from '../types.js';

// recreates an array
export default function recreate(
  this: MatreshkaArrayInstance,
  newItemsOrNull: ArrayLike<any> | null = [],
  eventOptions: ArrayMethodOptions = {}
): MatreshkaArrayInstance {
  // null empties the array, as undefined does
  const givenNewItems = newItemsOrNull ?? [];
  const def = syncFields(this);
  const { itemMediator } = def;
  const newLength = givenNewItems.length;
  const oldLength = this.length;
  const lengthDiff = oldLength - newLength;
  const was = this.toJSON(false);
  const { trackBy } = this;
  const { skipItemMediator } = eventOptions;
  let newItems: any[];

  if (trackBy) {
    // if trackBy property is given then update givenNewItems array
    newItems = updateTracked({
      arr: this,
      givenNewItems,
      trackBy
    });
  } else {
    // if trackBy is not given then use given new items as is (an array-like is copied into an array)
    newItems = Array.isArray(givenNewItems) ? givenNewItems : Array.from(givenNewItems);
  }

  // call item mediator for every new item (but don't modify passed newItems)
  if (itemMediator && !skipItemMediator) {
    const toMediate = newItems;
    newItems = Array(newLength);
    for (let i = 0; i < newLength; i++) {
      newItems[i] = itemMediator(toMediate[i], i);
    }
  }

  // update array indexes with new values
  for (let i = 0; i < newLength; i++) {
    this[i] = newItems[i];
  }

  // remove old items that is out of new length
  for (let i = 0; i < lengthDiff; i++) {
    delete this[i + newLength];
  }

  // update length
  withLengthOptions(this, eventOptions, () => {
    this.length = newLength;
  });

  // counted per value, so a dropped duplicate counts as removed
  const removed = itemsNotIn(was, newItems);
  const added = itemsNotIn(newItems, was);

  let reordered = false;
  if (!added.length && !removed.length) {
    for (let i = 0; i < newLength; i++) {
      if (newItems[i] !== was[i]) {
        reordered = true;
        break;
      }
    }
  }

  reportModified(
    this,
    {
      added,
      removed,
      method: 'recreate',
      self: this,
      ...eventOptions
    },
    reordered
  );

  return this;
}
