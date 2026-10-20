// Array.from where the browser has it, so iterables work too; IE 11 takes array-likes only, holes included
export default function arrayFrom(value: any, mapFn?: (value: any, index: number) => any, thisArg?: any): any[] {
  if (Array.from) return Array.from(value, mapFn as (value: any, index: number) => any, thisArg);
  const length = Math.max(0, Math.floor(value.length) || 0);
  const result: any[] = [];
  for (let i = 0; i < length; i++) result.push(mapFn ? mapFn.call(thisArg, value[i], i) : value[i]);
  return result;
}
