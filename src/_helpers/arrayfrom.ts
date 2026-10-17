import toArray from './toarray.js';

// Array.from where the browser has it, so iterables work too; IE 11 takes array-likes only
export default function arrayFrom(value: any, mapFn?: (value: any, index: number) => any, thisArg?: any): any[] {
  if (Array.from) return Array.from(value, mapFn as (value: any, index: number) => any, thisArg);
  const result = toArray(value);
  return mapFn ? result.map(mapFn, thisArg) : result;
}
