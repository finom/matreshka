// returns a binder for output element
export default function output() {
  return {
    on: null,
    getValue() {
      return this.value || this.textContent;
    },
    setValue(value) {
      const property = 'form' in this ? 'value' : 'textContent';
      this[property] = value === null || value === undefined ? '' : `${value}`;
    }
  };
}
