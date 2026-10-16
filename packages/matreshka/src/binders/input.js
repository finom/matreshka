// returns a binder for input element based on its type
export default function input(type) {
  let on;
  switch (type) {
    case 'checkbox':
      return {
        on: 'click keyup',
        getValue() {
          return this.checked;
        },
        setValue(value) {
          this.checked = value;
        }
      };
    case 'radio':
      return {
        on: 'click keyup',
        // an unchecked radio keeps the value of its checked sibling
        getValue({ previousValue } = {}) {
          return this.checked ? this.value : previousValue;
        },
        setValue(value) {
          this.checked = typeof value !== 'undefined' && this.value === value;
        }
      };
    case 'submit':
    case 'button':
    case 'image':
    case 'reset':
      return {};
    case 'hidden':
      on = null;
      break;
    case 'file':
      on = 'change';
      break;

    /*
            case 'text':
            case 'password':
            case 'date':
            case 'datetime':
            case 'datetime-local':
            case 'month':
            case 'time':
            case 'week':
            case 'range':
            case 'color':
            case 'search':
            case 'email':
            case 'tel':
            case 'url':
            case 'file':
            case 'number': */
    default: // other future (HTML6+) inputs
      on = 'input';
  }

  return {
    on,
    getValue() {
      return this.value;
    },
    setValue(value) {
      this.value = value === null || value === undefined ? '' : value;
    }
  };
}
