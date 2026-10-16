// returns a binder for element attribute
export default function attr(attributeName, mappingFn) {
  return {
    on: null,
    getValue() {
      return this.getAttribute(attributeName);
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.setAttribute(attributeName, val === null || val === undefined ? '' : val);
    }
  };
}
