import MatreshkaArray from './index';
import forEach from '../_helpers/foreach';

// creates a new Matreshka.Array instance with a variable number of arguments,
// regardless of number or type of the arguments
export default function of() {
  // allow to inherit this method by child classes
  const ParentClass = typeof this === 'function' ? this : MatreshkaArray;

  const result = new ParentClass();
  const newItems = Array(arguments.length);

  forEach(arguments, (item, index) => {
    newItems[index] = item;
  });

  // recreate applies Model and item mediator of the class
  return result.recreate(newItems, {
    silent: true,
    dontRender: true
  });
}
