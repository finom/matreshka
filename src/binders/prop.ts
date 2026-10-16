import type { AnyObject, Binder } from '../types.js';

// returns a binder to change properties of an element
export default function prop(propertyName: string, mappingFn?: (value: any) => any): Binder {
  return {
    on: null,
    getValue(this: AnyObject) {
      return this[propertyName];
    },
    setValue(this: AnyObject, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      try {
        this[propertyName] = val;
      } catch {
        // the property is read-only (eg tagName)
      }
    }
  };
}
