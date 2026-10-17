import type { MatreshkaArrayInstance } from './types.js';

// Symbol.iterator of Matreshka.Array instances
export default function matreshkaArrayIterator(this: MatreshkaArrayInstance): IterableIterator<any> {
  let i = 0;

  const result = {
    next: () => {
      if (i > this.length - 1) {
        return { done: true } as IteratorReturnResult<any>;
      }

      return {
        done: false,
        value: this[i++]
      };
    }
  } as IterableIterator<any>;

  result[Symbol.iterator] = () => result;

  return result;
}
