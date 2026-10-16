import MatreshkaArray from './index';

// creates a new Matreshka.Array instance from an array-like or iterable object
export default function from(arrayLike, mapFn, thisArg) {
  // allow to inherit this method by child classes
  const ParentClass = typeof this === 'function' ? this : MatreshkaArray;
  const result = new ParentClass();

  // recreate applies Model and item mediator of the class
  return result.recreate(Array.from(arrayLike, mapFn, thisArg), {
    silent: true,
    dontRender: true
  });
}
