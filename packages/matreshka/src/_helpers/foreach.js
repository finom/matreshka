export default function forEach(arr, callback) {
  let i = 0;
  const l = arr.length;

  for (; i < l; i++) {
    callback(arr[i], i);
  }
}
