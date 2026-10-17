// a key named __proto__ is a key like any other: only the object's own value, never its prototype
export default function getProp(object: any, key: string): any {
  return key === '__proto__' && !Object.hasOwn(object, key) ? undefined : object[key];
}
