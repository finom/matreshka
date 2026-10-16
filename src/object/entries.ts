import defs from '../_core/defs.js';
import type { AnyObject } from '../types.js';

// returns an array which contains things like [key, value]
export default function keys(this: AnyObject): [string, any][] {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return [];
  }

  const keysArr = Object.keys(def.keys);
  const { length } = keysArr;
  const result: [string, any][] = new Array(length);

  for (let i = 0; i < keysArr.length; i++) {
    const key = keysArr[i];
    result[i] = [key, this[key]];
  }

  return result;
}
