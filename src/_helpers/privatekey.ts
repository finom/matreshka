// a symbol, or a string key where the browser has no Symbol (IE 11)
export default function privateKey(name: string): any {
  return typeof Symbol === 'function' ? Symbol(name) : `@@matreshka:${name}`;
}
