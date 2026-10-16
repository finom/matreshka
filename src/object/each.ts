import defs from '../_core/defs.js';
import forOwn from '../_helpers/forown.js';
import type { AnyObject } from '../types.js';

// iterates over data keys and calls callback on every iteration
// @IE for..of is preferable and the method will be removed in one of major versions
export default function each<T extends AnyObject>(
  this: T,
  callback: (this: any, value: any, key: string, self: T) => void,
  thisArg?: any
): T {
  const def = defs.get(this);
  const ctx = typeof thisArg !== 'undefined' ? thisArg : this;

  /* istanbul ignore if */
  if (!def) {
    return this;
  }

  forOwn(def.keys, (_, key) => {
    callback.call(ctx, this[key], key, this);
  });

  return this;
}
