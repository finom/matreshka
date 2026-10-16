import defs from '../_core/defs.js';
import type { AnyObject } from '../types.js';

// returns an array which contains all data values
export default function keys(this: AnyObject): any[] {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return [];
  }

  const keysArr = Object.keys(def.keys);
  const { length } = keysArr;
  const result: any[] = new Array(length);

  for (let i = 0; i < keysArr.length; i++) {
    result[i] = this[keysArr[i]];
  }

  return result;
}
