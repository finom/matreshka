import type { Binder } from '../types.js';

// returns a binder for innerHTML of an element
export default function html(mappingFn?: (value: any) => any): Binder {
  return {
    // the event fires only in contenteditable mode
    on: 'input',
    getValue(this: Element) {
      return this.innerHTML;
    },
    setValue(this: Element, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      if (val instanceof window.HTMLElement) {
        this.innerHTML = '';
        this.appendChild(val);
      } else {
        this.innerHTML = val === null || val === undefined ? '' : String(val);
      }
    }
  };
}
