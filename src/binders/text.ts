import type { Binder } from '../types.js';

// returns a binder for textContent of an element
export default function text(mappingFn?: (value: any) => any): Binder {
  return {
    // the event fires only in contenteditable mode
    on: 'input',
    getValue(this: Node) {
      return this.textContent;
    },
    setValue(this: Node, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.textContent = val === null || val === undefined ? '' : String(val);
    }
  };
}
