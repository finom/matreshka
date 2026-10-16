import defs from '../_core/defs.js';
import type { AnyObject } from '../types.js';

// returns an array which contains all data keys
export default function keys(this: AnyObject): string[] {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return [];
  }

  return Object.keys(def.keys);
}
