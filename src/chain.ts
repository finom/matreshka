import checkObjectType from './_helpers/checkobjecttype.js';
import forEach from './_helpers/foreach.js';
import * as universalMethods from './matreshka/_universalmethods.js';
import Class from './class.js';
import apply from './_helpers/apply.js';

type UniversalMethods = typeof universalMethods;

// the parameter lists of a function with up to four overloads
type OverloadParameters<F> = F extends {
  (...args: infer A1): any;
  (...args: infer A2): any;
  (...args: infer A3): any;
  (...args: infer A4): any;
}
  ? A1 | A2 | A3 | A4
  : never;

// a parameter list without the object
type WithoutObject<A> = A extends [any, ...infer Rest] ? Rest : never;

// the universal methods with the object bound; each returns the chain: chain(object).set('a', 1).on(...)
export type Chain = { object: object } & {
  [K in keyof UniversalMethods]: (...args: WithoutObject<OverloadParameters<UniversalMethods[K]>>) => Chain;
};

// create a prototype of ChainClass
// store target object at "object" property
const prototype: Record<string, any> = {
  constructor(this: Chain, object: object) {
    this.object = object;
  }
};

const methodNames = Object.keys(universalMethods) as (keyof UniversalMethods)[];

// iterate over all universal methods
for (let i = 0; i < methodNames.length; i++) {
  const methodName = methodNames[i];
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: every universal method gets a chained twin
  const method = universalMethods[methodName] as (...args: any[]) => any;

  // create every chained method
  prototype[methodName] = function chainedMethod(this: Chain) {
    const args: any[] = [this.object];

    forEach(arguments, (argument) => {
      args.push(argument);
    });

    apply(method, undefined, args);

    // returning this is important for chained calls
    return this;
  };
}

const ChainClass = Class(prototype) as unknown as new (object: object) => Chain;

// the function allows to chain static function calls on any object
export default function chain(object: object): Chain {
  // check for type and throw an error if it is not an object and is not a function
  checkObjectType(object, 'chain');

  return new ChainClass(object);
}
