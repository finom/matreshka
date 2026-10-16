// returns a binder for innerHTML of an element
export default function html(mappingFn) {
  return {
    // the event fires only in contenteditable mode
    on: 'input',
    getValue() {
      return this.innerHTML;
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      if (val instanceof window.HTMLElement) {
        this.innerHTML = '';
        this.appendChild(val);
      } else {
        this.innerHTML = val === null || val === undefined ? '' : `${val}`;
      }
    }
  };
}
