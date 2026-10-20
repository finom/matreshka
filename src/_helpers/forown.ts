export default function forOwn<T>(obj: Record<string, T>, callback: (value: T, key: string) => void): void {
  // Object(): IE 11's Object.keys throws on a primitive
  const keys = Object.keys(Object(obj));
  const l = keys.length;
  let i = 0;
  let key: string;

  while (i < l) {
    key = keys[i];
    i += 1;
    callback(obj[key], key);
  }
}
