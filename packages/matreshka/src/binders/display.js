// returns a binder to switch visibility of an element
export default function display(switcher = true) {
  return {
    on: null,
    getValue() {
      const value = this.style.display || window.getComputedStyle(this).getPropertyValue('display');
      const none = value === 'none';
      return switcher ? !none : none;
    },
    setValue(value) {
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
