// Symbol.iterator of Matreshka.Array instances
export default function matreshkaArrayIterator() {
  let i = 0;

  return {
    next: () => {
      if (i > this.length - 1) {
        return {
          done: true
        };
      }

      return {
        done: false,
        value: this[i++]
      };
    }
  };
}
