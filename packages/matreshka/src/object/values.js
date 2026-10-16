import defs from '../_core/defs';

// returns an array which contains all data values
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
    result[i] = this[keysArr[i]];
  }

  return result;
}
