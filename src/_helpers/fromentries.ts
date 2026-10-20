// Object.fromEntries for an array of pairs; IE 11 lacks it. Defined, not assigned, so "__proto__" stays a key
export default function fromEntries(entries: [string, any][]): Record<string, any> {
  const result: Record<string, any> = {};
  for (let i = 0; i < entries.length; i++) {
    Object.defineProperty(result, entries[i][0], {
      value: entries[i][1],
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  return result;
}
