// returns a binder for className of an element
// switcher=false adds the class when the value is falsy
export default function className(elementClassName, switcher = true) {
  return {
    on: null,
    getValue() {
      const value = this.classList.contains(elementClassName);
      return switcher ? value : !value;
    },
    setValue(value) {
      this.classList.toggle(elementClassName, switcher ? !!value : !value);
    }
  };
}
