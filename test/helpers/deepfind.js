export default function (obj, path) {
  const paths = typeof path === 'string' ? path.split('.') : path;
  let current = obj;

  for (let i = 0; i < paths.length; ++i) {
    if (typeof current[paths[i]] === 'undefined') {
      return undefined;
    }

    current = current[paths[i]];
  }

  return current;
}
