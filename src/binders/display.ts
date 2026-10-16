import type { Binder } from '../types.js';

// returns a binder to switch visibility of an element
export default function display(switcher: boolean | ((value: any) => any) = true): Binder {
  return {
    on: null,
    getValue(this: HTMLElement) {
      const value = this.style.display || window.getComputedStyle(this).getPropertyValue('display');
      const none = value === 'none';
      return switcher ? !none : none;
    },
    setValue(this: HTMLElement, value: any) {
      const { style } = this;

      if (typeof switcher === 'function') {
        style.display = switcher(value) ? '' : 'none';
      } else if (switcher) {
        style.display = value ? '' : 'none';
      } else {
        style.display = value ? 'none' : '';
      }
    }
  };
}
