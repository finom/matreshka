import defs from '../_core/defs';

// checks is a key present in data keys list
export default function isDataKey(key) {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return false;
  }

  return key in def.keys;
}
