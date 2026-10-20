import forEach from './foreach.js';

const isEnumerable = Object.prototype.propertyIsEnumerable;

// Object.assign, which IE 11 lacks; symbol keys are copied where the browser has them
const assign: typeof Object.assign = function assign(target: any) {
  for (let i = 1; i < arguments.length; i++) {
    if (arguments[i] !== null && arguments[i] !== undefined) {
      // a primitive is read as an object: IE 11's Object.keys throws on it
      const source = Object(arguments[i]);
      forEach(Object.keys(source), (key) => {
        target[key] = source[key];
      });
      if (Object.getOwnPropertySymbols) {
        forEach(Object.getOwnPropertySymbols(source), (symbol) => {
          if (isEnumerable.call(source, symbol)) target[symbol] = source[symbol];
        });
      }
    }
  }
  return target;
};

export default assign;
