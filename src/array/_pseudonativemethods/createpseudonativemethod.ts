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

// the native methods are called on Matreshka.Array instances, which are array-like
const arrayPrototype = Array.prototype as unknown as Record<
  string,
  (this: MatreshkaArrayInstance, ...args: any[]) => any
>;

// creates pseudo native method and returns it (push, push_, sort, sort_...)
export default function createPseudoNativeMethod(name: string, hasOptions = false): PseudoNativeMethod | undefined {
  switch (name) {
    case 'forEach':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance, callback: any, thisArg?: any) {
        arrayPrototype[name].call(this, callback, thisArg);
        // return this for nicer chain calls
        return this;
      };
    case 'map':
    case 'filter':
    case 'slice':
      // TODO: Improve readability of pseudoNativeMethod, arguments "a, b" look not good
      return function pseudoNativeMethod(this: MatreshkaArrayInstance, a?: any, b?: any) {
        return toMatreshkaArray(arrayPrototype[name].call(this, a, b));
      };
    case 'every':
    case 'some':
    case 'findIndex':
    case 'find':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance, callback: any, thisArg?: any) {
        return arrayPrototype[name].call(this, callback, thisArg);
      };
    case 'join':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance, separator = ',') {
        return arrayPrototype[name].call(this, separator);
      };
    case 'indexOf':
    case 'lastIndexOf':
    case 'includes':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance, searchElement: any, fromIndex?: number) {
        const originalMethod = arrayPrototype[name];

        if (typeof fromIndex === 'undefined') {
          return originalMethod.call(this, searchElement);
        }

        return originalMethod.call(this, searchElement, fromIndex);
      };
    case 'reduce':
    case 'reduceRight':
      return function pseudoNativeMethod(this: MatreshkaArrayInstance) {
        return apply(arrayPrototype[name], this, arguments);
      };
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
    default:
      return undefined;
  }
}
