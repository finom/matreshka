import getProp from './getprop.js';

// gets value of a property in nested object
// eg "d" from a.b.c.d
export default function deepFind(obj: any, path: string): any {
  const paths = path.split('.');
  let current = obj;

  for (let i = 0; i < paths.length; ++i) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = getProp(current, paths[i]);
  }

  return current;
}
