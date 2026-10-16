import checkObjectType from './_helpers/checkobjecttype';
import forEach from './_helpers/foreach';
import * as universalMethods from './matreshka/_universalmethods';
import Class from './class';
import apply from './_helpers/apply';

// create a prototype of ChainClass
// store target object at "object" property
const prototype = {
  constructor(object) {
    this.object = object;
  }
};

const methodNames = Object.keys(universalMethods);

// iterate over all universal methods
for (let i = 0; i < methodNames.length; i++) {
  const methodName = methodNames[i];
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: every universal method gets a chained twin
  const method = universalMethods[methodName];

  // create every chained method
  prototype[methodName] = function chainedMethod() {
    const args = [this.object];

    forEach(arguments, (argument) => {
      args.push(argument);
    });

    apply(method, undefined, args);

    // returning this is important for chained calls
    return this;
  };
}

const ChainClass = Class(prototype);

// the function allows to chain static function calls on any object
export default function chain(object) {
  // check for type and throw an error if it is not an object and is not a function
  checkObjectType(object, 'chain');

  return new ChainClass(object);
}
