export default function forOwn<T>(obj: Record<string, T>, callback: (value: T, key: string) => void): void {
  const keys = Object.keys(obj);
  const l = keys.length;
  let i = 0;
  let key: string;

  while (i < l) {
    key = keys[i];
    i += 1;
    callback(obj[key], key);
  }
}
