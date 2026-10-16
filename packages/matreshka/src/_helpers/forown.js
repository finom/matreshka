export default function forOwn(obj, callback) {
  const keys = Object.keys(obj);
  const l = keys.length;
  let i = 0;
  let key;

  while (i < l) {
    key = keys[i];
    i += 1;
    callback(obj[key], key);
  }
}
