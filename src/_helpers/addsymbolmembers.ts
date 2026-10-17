// puts the Symbol-keyed members on a prototype; IE 11 has no Symbol, and gets none
export default function addSymbolMembers(
  members: Record<PropertyKey, any>,
  iterator: () => IterableIterator<any>,
  isConcatSpreadable = false
): void {
  if (typeof Symbol !== 'function') return;
  members[Symbol.iterator] = iterator;
  // a native concat spreads it as it spreads an array
  if (isConcatSpreadable) members[Symbol.isConcatSpreadable] = true;
}
