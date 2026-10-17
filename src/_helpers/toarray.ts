const { slice } = Array.prototype;

// an array from an array-like (arguments, NodeList, jQuery)
export default function toArray<T>(object: ArrayLike<T>): T[] {
  return slice.call(object);
}
