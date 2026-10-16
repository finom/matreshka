export default function toArray<T>(object: ArrayLike<T>): T[] {
  return Array.from(object);
}
