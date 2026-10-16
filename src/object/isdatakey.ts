import defs from '../_core/defs.js';
import type { AnyObject } from '../types.js';

// checks is a key present in data keys list
export default function isDataKey(this: AnyObject, key: string): boolean {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return false;
  }

  return key in def.keys;
}
