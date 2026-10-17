const has = Object.prototype.hasOwnProperty;

// Object.hasOwn, which IE 11 lacks
export default function hasOwn(object: object, key: PropertyKey): boolean {
  return has.call(object, key);
}
