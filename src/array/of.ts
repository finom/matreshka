import MatreshkaArray from './index.js';
import forEach from '../_helpers/foreach.js';
import type { MatreshkaArrayConstructor, MatreshkaArrayInstance } from './types.js';

// creates a new Matreshka.Array instance with a variable number of arguments,
// regardless of number or type of the arguments
export default function of(this: unknown, ..._items: any[]): MatreshkaArrayInstance {
  // allow to inherit this method by child classes
  const ParentClass = typeof this === 'function' ? (this as MatreshkaArrayConstructor) : MatreshkaArray;

  const result = new ParentClass();
  const newItems: any[] = Array(arguments.length);

  forEach(arguments, (item, index) => {
    newItems[index] = item;
  });

  // recreate applies Model and item mediator of the class
  return result.recreate(newItems, {
    silent: true,
    dontRender: true
  });
}
