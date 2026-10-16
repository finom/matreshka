// cheap conversion of an array-like object to Array instance
export default function toArray(object, start = 0) {
  const { length } = object;
  const array = Array(length);

  for (let i = start; i < length; i++) {
    array[i - start] = object[i];
  }

  return array;
}
