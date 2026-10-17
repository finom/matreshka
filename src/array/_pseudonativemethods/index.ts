import createPseudoNativeMethod, { changingMethodNames, methodNames } from './createpseudonativemethod.js';
import concat from './concat.js';
import keys from './keys.js';
import values from './values.js';
import entries from './entries.js';
import forEach from '../../_helpers/foreach.js';
import type { MatreshkaArrayInstance } from '../types.js';

type Methods = Record<string, (this: MatreshkaArrayInstance, ...args: any[]) => any>;

// the methods for the browser's arrays: one the browser lacks (includes, at, toSorted on IE 11) is left out, as on
// a native array; fill is Matreshka's own
export function createMethods(arrayPrototype: object): Methods {
  const methods: Methods = { concat, keys, values, entries };
  const isAvailable = (name: string) => name === 'fill' || name in arrayPrototype;

  forEach(methodNames, (name) => {
    if (isAvailable(name)) methods[name] = createPseudoNativeMethod(name);
  });

  forEach(changingMethodNames, (name) => {
    if (isAvailable(name)) methods[`${name}_`] = createPseudoNativeMethod(name, true);
  });

  return methods;
}

export default createMethods(Array.prototype);
