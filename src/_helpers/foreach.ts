export default function forEach<T>(arr: ArrayLike<T>, callback: (item: T, index: number) => void): void {
  let i = 0;
  const l = arr.length;

  for (; i < l; i++) {
    callback(arr[i], i);
  }
}
