import MatreshkaArray from './index.js';
import type { MatreshkaArrayConstructor, MatreshkaArrayInstance } from './types.js';

// creates a new Matreshka.Array instance from an array-like or iterable object
export default function from(
  this: unknown,
  arrayLike: ArrayLike<any> | Iterable<any>,
  mapFn?: (value: any, index: number) => any,
  thisArg?: any
): MatreshkaArrayInstance {
  // allow to inherit this method by child classes
  const ParentClass = typeof this === 'function' ? (this as MatreshkaArrayConstructor) : MatreshkaArray;
  const result = new ParentClass();

  // recreate applies Model and item mediator of the class
  return result.recreate(Array.from(arrayLike, mapFn as (value: any, index: number) => any, thisArg), {
    silent: true,
    dontRender: true
  });
}
