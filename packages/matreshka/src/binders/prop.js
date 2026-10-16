// returns a binder to change properties of an element
export default function prop(propertyName, mappingFn) {
  return {
    on: null,
    getValue() {
      return this[propertyName];
    },
    setValue(value) {
      const val = typeof mappingFn === 'function' ? mappingFn(value) : value;

      try {
        this[propertyName] = val;
      } catch {
        // the property is read-only (eg tagName)
      }
    }
  };
}
