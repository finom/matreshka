import type { Binder } from '../types.js';

// returns a binder for element attribute
export default function attr(attributeName: string, mappingFn?: (value: any) => any): Binder {
  return {
    on: null,
    getValue(this: Element) {
      return this.getAttribute(attributeName);
    },
    setValue(this: Element, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.setAttribute(attributeName, val === null || val === undefined ? '' : val);
    }
  };
}
