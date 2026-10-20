import toMatreshkaArray from '../_tomatreshkaarray.js';
import createSortingMethod from './createsortingmethod.js';
import createRemovingMethod from './createremovingmethod.js';
import createAddingMethod from './createaddingmethod.js';
import createSplice from './createsplice.js';
import createCopyWithin from './createcopywithin.js';
import createFill from './createfill.js';
import apply from '../../_helpers/apply.js';
import type { MatreshkaArrayInstance } from '../types.js';

type PseudoNativeMethod = (this: MatreshkaArrayInstance, ...args: any[]) => any;

// the methods that change the array; each also has a `name_` twin that takes event options last
export const changingMethodNames = [
  'push',
  'pop',
  'unshift',
  'shift',
  'sort',
  'reverse',
  'splice',
  'copyWithin',
  'fill'
] as const;

// the methods that copy; they return a Matreshka.Array
const copyingMethodNames = ['map', 'filter', 'slice', 'toSorted', 'toReversed', 'toSpliced', 'with'];

export const methodNames = [
  ...changingMethodNames,
  'forEach',
  'map',
  'filter',
  'slice',
  'flat',
  'flatMap',
  'toSorted',
  'toReversed',
  'toSpliced',
  'with',
  'every',
  'some',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'at',
  'join',
  'indexOf',
  'lastIndexOf',
  'includes',
  'reduce',
  'reduceRight',
  'toString',
  'toLocaleString'
] as const;

// the native methods are called on Matreshka.Array instances, which are array-like
const arrayPrototype = Array.prototype as unknown as Record<
  string,
  (this: MatreshkaArrayInstance, ...args: any[]) => any
>;

// a nested Matreshka.Array is spread like an array, as concat does: up to `depth` levels are made arrays
function spreadNested(value: any, depth: number): any {
  return depth >= 1 && value && typeof value === 'object' && (value.isMatreshkaArray || Array.isArray(value))
    ? arrayPrototype.map.call(value, (item: any) => spreadNested(item, depth - 1))
    : value;
}

function flat(this: MatreshkaArrayInstance, depth?: any): MatreshkaArrayInstance {
  const levels = typeof depth === 'undefined' ? 1 : +depth || 0;
  const items = arrayPrototype.map.call(this, (item: any) => spreadNested(item, levels));
  return toMatreshkaArray(apply(arrayPrototype.flat, items, arguments));
}

function flatMap(this: MatreshkaArrayInstance, callback: any, thisArg?: any): MatreshkaArrayInstance {
  // a non-function goes as is, so the native method throws its TypeError
  const spreading =
    typeof callback === 'function'
      ? function spreadResult(this: any) {
          const result = apply(callback, this, arguments);
          return result && typeof result === 'object' && result.isMatreshkaArray ? result.toJSON(false) : result;
        }
      : callback;
  return toMatreshkaArray(arrayPrototype.flatMap.call(this, spreading, thisArg));
}

// creates pseudo native method and returns it (push, push_, sort, sort_...)
export default function createPseudoNativeMethod(
  name: (typeof methodNames)[number],
  hasOptions = false
): PseudoNativeMethod {
  switch (name) {
    case 'sort':
    case 'reverse':
      return createSortingMethod(name, hasOptions);
    case 'pop':
    case 'shift':
      return createRemovingMethod(name, hasOptions);
    case 'push':
    case 'unshift':
      return createAddingMethod(name, hasOptions);
    case 'splice':
      return createSplice(hasOptions);
    case 'copyWithin':
      return createCopyWithin(hasOptions);
    case 'fill':
      return createFill(hasOptions);
    case 'flat':
      return flat;
    case 'flatMap':
      return flatMap;
    case 'forEach':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance) {
        apply(arrayPrototype.forEach, this, arguments);
        // return this for nicer chain calls
        return this;
      };
    default:
      if (copyingMethodNames.indexOf(name) !== -1) {
        return function pseudoNativeMethod(this: MatreshkaArrayInstance) {
          return toMatreshkaArray(apply(arrayPrototype[name], this, arguments));
        };
      }
      // the other methods read the array and get the arguments as given: lastIndexOf(x, undefined) searches from 0
      return function pseudoNativeMethod(this: MatreshkaArrayInstance) {
        return apply(arrayPrototype[name], this, arguments);
      };
  }
}
