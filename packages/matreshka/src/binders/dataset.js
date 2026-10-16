// returns a binder for dataset of an element
export default function dataset(prop, mappingFn) {
  return {
    on: null,
    getValue() {
      return this.dataset[prop];
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;
      this.dataset[prop] = val === null || val === undefined ? '' : val;
    }
  };
}
