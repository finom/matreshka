import type { Binder } from '../types.js';

// returns a binder for dataset of an element
export default function dataset(prop: string, mappingFn?: (value: any) => any): Binder {
  return {
    on: null,
    getValue(this: HTMLElement) {
      return this.dataset[prop];
    },
    setValue(this: HTMLElement, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.dataset[prop] = val === null || val === undefined ? '' : val;
    }
  };
}
