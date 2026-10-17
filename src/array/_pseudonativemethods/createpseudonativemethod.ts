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
const copyingMethodNames = ['map', 'filter', 'slice', 'flat', 'flatMap', 'toSorted', 'toReversed', 'toSpliced', 'with'];

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
