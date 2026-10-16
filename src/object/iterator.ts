import type { AnyObject } from '../types.js';

// Symbol.iterator of Matreshka.Object instances
export default function matreshkaObjectIterator(this: AnyObject): Iterator<any> {
  const keys: string[] = this.keys();
  let i = 0;

  return {
    next: () => {
      if (i > keys.length - 1) {
        // no value, as before
        return { done: true } as IteratorReturnResult<any>;
      }

      return {
        done: false,
        value: this[keys[i++]]
      };
    }
  };
}
