// returns pairs like [index, value]
export default function values() {
  const { length } = this;
  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = [i, this[i]];
  }

  return result;
}
