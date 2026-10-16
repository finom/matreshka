import apply from '../../_helpers/apply';
import forEach from '../../_helpers/foreach';
import MatreshkaArray from '../index';

// the method works just like Array.prototype.concat but
// - flattens both Array and Matreshka.Array
// - returns Matreshka.Array
export default function concat() {
  const args = Array(arguments.length);

  // convert all instances of Matreshka.Array to Array
  forEach(arguments, (arg, index) => {
    if (arg && typeof arg === 'object' && arg.isMatreshkaArray) {
      args[index] = arg.toJSON(false);
    } else {
      args[index] = arg;
    }
  });

  // call original concat method
  const nativeCallResult = apply(Array.prototype.concat, this.toJSON(false), args);

  // convert returned value to Matreshka.Array
  const result = new MatreshkaArray();
  forEach(nativeCallResult, (item, index) => {
    result[index] = item;
  });

  result.length = nativeCallResult.length;

  return result;
}
