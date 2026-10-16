import forEach from '../_helpers/foreach';
import MatreshkaArray from './index';

// converts array-like to Matreshka.Array instance
export default function toMatreshkaArray(arrayLike) {
  const result = new MatreshkaArray(arrayLike.length);

  forEach(arrayLike, (item, index) => {
    result[index] = item;
  });

  return result;
}
