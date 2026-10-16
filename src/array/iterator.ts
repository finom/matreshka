import type { MatreshkaArrayInstance } from './types.js';

// Symbol.iterator of Matreshka.Array instances
export default function matreshkaArrayIterator(this: MatreshkaArrayInstance): {
  next: () => { done: boolean; value?: any };
} {
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
