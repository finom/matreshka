import type { Binder } from '../types.js';

// returns a binder for className of an element
// switcher=false adds the class when the value is falsy
export default function className(elementClassName: string, switcher = true): Binder {
  return {
    on: null,
    getValue(this: Element) {
      const value = this.classList.contains(elementClassName);
      return switcher ? value : !value;
    },
    setValue(this: Element, value: any) {
      this.classList.toggle(elementClassName, switcher ? !!value : !value);
    }
  };
}
