// Object.values, which IE 11 lacks
export default function objectValues<T>(object: Record<string, T>): T[] {
  const keys = Object.keys(object);
  const result: T[] = [];
  for (let i = 0; i < keys.length; i++) result.push(object[keys[i]]);
  return result;
}
