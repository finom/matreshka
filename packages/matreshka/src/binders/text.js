// returns a binder for textContent of an element
export default function text(mappingFn) {
  return {
    // the event fires only in contenteditable mode
    on: 'input',
    getValue() {
      return this.textContent;
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.textContent = val === null || val === undefined ? '' : `${val}`;
    }
  };
}
