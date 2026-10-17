// matreshkaError for the minified bundles: the error's code and its plain details instead of the full text,
// which dist/matreshka.js and the npm modules keep
export default function matreshkaError(key, data = {}) {
  const details = Object.keys(data)
    .filter((name) => typeof data[name] === 'string' || typeof data[name] === 'number')
    .map((name) => `${name}: ${JSON.stringify(data[name])}`)
    .join(', ');
  return Error(`Matreshka error ${key}${details ? ` (${details})` : ''}; matreshka.js has the full message`);
}
