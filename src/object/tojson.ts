import initMK from '../_core/init.js';
import forOwn from '../_helpers/forown.js';
import type { AnyObject } from '../types.js';

// converts Matreshka.Object instance to ordinary object
export default function toJSON(this: AnyObject, recursive = true): Record<string, any> {
  const { keys } = initMK(this);
  const result: Record<string, any> = {};

  forOwn(keys, (_, key) => {
    const value = this[key];
    // when recursive is true and when value has toJSON method then call it recusively
    // defined, not assigned: a data key named __proto__ is a key, not the result's prototype
    Object.defineProperty(result, key, {
      value: recursive && value && typeof value.toJSON === 'function' ? value.toJSON(true) : value,
      enumerable: true,
      writable: true,
      configurable: true
    });
  });

  return result;
}
