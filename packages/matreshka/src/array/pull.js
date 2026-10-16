import syncFields from './_syncfields';
import reportModified from './_reportmodified';
import matreshkaError from '../_helpers/matreshkaerror';

// removes an item by a valid index and returns it
function removeAt(arr, index) {
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
export default function pull(toRemove, eventOptions = {}) {
  syncFields(this);
  const typeofToRemove = typeof toRemove;
  let index;

  if (toRemove && typeofToRemove === 'object') {
    index = Array.prototype.indexOf.call(this, toRemove);
  } else if (typeofToRemove === 'number') {
    index = Number.isInteger(toRemove) && toRemove < this.length ? toRemove : -1;
  } else {
    throw matreshkaError('pull:to_remove_type', { toRemove });
  }

  if (index < 0) {
    return null;
  }

  const removed = removeAt(this, index);

  reportModified(this, {
    method: 'pull',
    self: this,
    added: [],
    removed: [removed],
    ...eventOptions
  });

  return removed;
}
