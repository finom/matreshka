import defs from '../_core/defs';

// iterates over data keys looking for a property with given value
// and returns a key of found property
export default function keyOf(value) {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return null;
  }

  const keysArray = Object.keys(def.keys);

  for (let i = 0; i < keysArray.length; i++) {
    const key = keysArray[i];
    if (this[key] === value) {
      return key;
    }
  }

  return null;
}
