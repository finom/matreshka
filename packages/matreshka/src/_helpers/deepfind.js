// gets value of a property in nested object
// eg "d" from a.b.c.d
export default function deepFind(obj, givenPath) {
  const paths = typeof givenPath === 'string' ? givenPath.split('.') : givenPath;
  let current = obj;

  for (let i = 0; i < paths.length; ++i) {
    if (current === null || current === undefined || typeof current[paths[i]] === 'undefined') {
      return undefined;
    }

    current = current[paths[i]];
  }

  return current;
}
