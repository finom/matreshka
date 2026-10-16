// returns a binder for style properties
// the property is camel-cased (backgroundColor); a dashed (background-color) or custom (--x) name works too
export default function style(property, mappingFn) {
  const isDashed = property.includes('-');

  return {
    on: null,
    getValue() {
      if (isDashed) {
        return this.style.getPropertyValue(property) || window.getComputedStyle(this).getPropertyValue(property);
      }

      return this.style[property] || window.getComputedStyle(this)[property];
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      if (!isDashed) {
        this.style[property] = val;
      } else if (val === null || val === undefined || val === '') {
        this.style.removeProperty(property);
      } else {
        this.style.setProperty(property, val);
      }
    }
  };
}
