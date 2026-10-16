// returns a binder for select element
export default function select(multiple) {
  if (multiple) {
    return {
      on: 'change',
      getValue() {
        const { options } = this;
        const result = [];

        for (let i = 0; options.length > i; i++) {
          if (options[i].selected) {
            result.push(options[i].value);
          }
        }

        return result;
      },
      setValue(givenValue) {
        const { options } = this;
        let values = [];

        if (Array.isArray(givenValue)) {
          values = givenValue;
        } else if (givenValue !== null && givenValue !== undefined) {
          values = [givenValue];
        }

        // option values are strings, so [1] selects the option "1" as the single select does
        values = values.map(String);

        for (let i = options.length - 1; i >= 0; i--) {
          options[i].selected = values.includes(options[i].value);
        }
      }
    };
  }

  return {
    on: 'change',
    getValue() {
      return this.value;
    },
    setValue(value) {
      this.value = value;

      // an empty value selects the option without value; 0 is a value
      if (!value && value !== 0) {
        const { options } = this;
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].value) {
            options[i].selected = true;
            break;
          }
        }
      }
    }
  };
}
