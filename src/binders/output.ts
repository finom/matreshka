import type { Binder } from '../types.js';

// returns a binder for output element
export default function output(): Binder {
  return {
    on: null,
    getValue(this: HTMLOutputElement) {
      return this.value || this.textContent;
    },
    setValue(this: HTMLOutputElement, value: any) {
      const property = 'form' in this ? 'value' : 'textContent';
      this[property] = value === null || value === undefined ? '' : String(value);
    }
  };
}
