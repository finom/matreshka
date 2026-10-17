import syncFields from './_syncfields.js';
import reportModified from './_reportmodified.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import withLengthOptions from './_withlengthoptions.js';
import type { ArrayMethodOptions, MatreshkaArrayInstance } from './types.js';

// removes an item by a valid index and returns it
function removeAt(arr: MatreshkaArrayInstance, index: number): any {
  const value = arr[index];

  for (let i = index; i < arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }

  delete arr[arr.length - 1];
  arr.length -= 1;

  return value;
}

// removes an array item by index (if number is given) or by value (if object is given)
// returns the removed item or null when nothing is removed
export default function pull(this: MatreshkaArrayInstance, toRemove: any, eventOptions: ArrayMethodOptions = {}): any {
  syncFields(this);
  const typeofToRemove = typeof toRemove;
  let index: number;

  if (toRemove && typeofToRemove === 'object') {
    index = Array.prototype.indexOf.call(this as unknown as any[], toRemove);
  } else if (typeofToRemove === 'number') {
    index = Number.isInteger(toRemove) && toRemove < this.length ? toRemove : -1;
  } else {
    throw matreshkaError('pull:to_remove_type', { toRemove });
  }

  if (index < 0) {
    return null;
  }

  const removed = withLengthOptions(this, eventOptions, () => removeAt(this, index));

  reportModified(this, {
    method: 'pull',
    self: this,
    added: [],
    removed: [removed],
    ...eventOptions
  });

  return removed;
}
