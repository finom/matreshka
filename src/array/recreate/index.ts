import syncFields from '../_syncfields.js';
import reportModified from '../_reportmodified.js';
import updateTracked from './_updatetracked.js';
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
  const { skipItemMediator, silent, dontRender } = eventOptions;
  let added: any[];
  let removed: any[];
  let newItems: any[];

  if (trackBy) {
    // if trackBy property is given then update givenNewItems array
    newItems = updateTracked({
      arr: this,
      givenNewItems,
      trackBy
    });
  } else {
    // if trackBy is not given then use given new items as is
    newItems = givenNewItems as any[];
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
  this.length = newLength;

  if (silent && dontRender) {
    return this;
  }

  // create an array of removed items
  // TODO: Optimize creation of "added" and "removed" options in recreate method
  // ... (do not use indexOf)
  if (newLength) {
    if (oldLength) {
      removed = [];
      for (let i = 0; i < oldLength; i++) {
        if (!~newItems.indexOf(was[i])) {
          removed.push(was[i]);
        }
      }
    } else {
      removed = [];
    }
  } else {
    removed = was;
  }

  // create an array of added items
  if (oldLength) {
    if (newLength) {
      added = [];
      for (let i = 0; i < newLength; i++) {
        if (!~was.indexOf(newItems[i])) {
          added.push(newItems[i]);
        }
      }
    } else {
      added = [];
    }
  } else {
    added = newItems;
  }

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
