// returns indexes
export default function keys() {
  const { length } = this;
  const result = new Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = i;
  }

  return result;
}
