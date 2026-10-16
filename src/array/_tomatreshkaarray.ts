import forEach from '../_helpers/foreach.js';
import MatreshkaArray from './index.js';
import type { MatreshkaArrayInstance } from './types.js';

// converts array-like to Matreshka.Array instance
export default function toMatreshkaArray<Item>(arrayLike: ArrayLike<Item>): MatreshkaArrayInstance<Item> {
  const result = new MatreshkaArray<Item>(arrayLike.length);

  forEach(arrayLike, (item, index) => {
    result[index] = item;
  });

  return result;
}
