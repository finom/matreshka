import defs from '../_core/defs';

// returns an array which contains things like [key, value]
export default function keys() {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return [];
  }

  const keysArr = Object.keys(def.keys);
  const { length } = keysArr;
  const result = new Array(length);

  for (let i = 0; i < keysArr.length; i++) {
    const key = keysArr[i];
    result[i] = [key, this[key]];
  }

  return result;
}
