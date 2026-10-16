import type { Binder } from '../types.js';

// returns a binder for style properties
// the property is camel-cased (backgroundColor); a dashed (background-color) or custom (--x) name works too
export default function style(property: string, mappingFn?: (value: any) => any): Binder {
  const isDashed = property.includes('-');

  return {
    on: null,
    getValue(this: HTMLElement) {
      if (isDashed) {
        return this.style.getPropertyValue(property) || window.getComputedStyle(this).getPropertyValue(property);
      }

      // a camel-cased name of CSSStyleDeclaration
      return (this.style as any)[property] || (window.getComputedStyle(this) as any)[property];
    },
    setValue(this: HTMLElement, value: any) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      if (!isDashed) {
        (this.style as any)[property] = val ?? '';
      } else if (val === null || val === undefined || val === '') {
        this.style.removeProperty(property);
      } else {
        this.style.setProperty(property, val);
      }
    }
  };
}
