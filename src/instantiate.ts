import type { Mediator } from './types.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import forOwn from './_helpers/forown.js';
import forEach from './_helpers/foreach.js';
import assign from './_helpers/assign.js';
import mediate from './mediate.js';

// a class instantiate creates property values with: new UsedClass(value, parent, key)
export type InstantiatedClass = new (value: any, parent: any, key: string) => any;

// updates the current instance with an assigned value instead of replacing it
export type InstantiateUpdateFunction = (this: any, instance: any, data: any, key: string) => void;

// the function is used when no update function is given
function defaultUpdateFunction(instance: any, data: any): void {
  if (instance.isMatreshkaArray) {
    instance.recreate(data);
  } else if (instance.isMatreshkaObject) {
    // take only data keys of an assigned Matreshka.Object, not its service properties
    instance.setData(data?.isMatreshkaObject ? data.toJSON(false) : data, { replaceData: true });
  } else {
    // for other objects just extend them with given data
    assign(instance, data);
  }
}

// returns mediator which controls assignments
function createInstantiateMediator({
  UsedClass,
  updateFunction
}: {
  UsedClass: InstantiatedClass;
  updateFunction: InstantiateUpdateFunction;
}): Mediator {
  return function mediator(value, previousValue, key, object) {
    if (previousValue instanceof UsedClass) {
      updateFunction.call(object, previousValue, value, key);
      return previousValue;
    }

    return new UsedClass(value, object, key);
  };
}

// creates an instance of given class as property value
// and updates an instance on new value assignment instead of actual assignment
export default function instantiate<T extends object>(
  object: T,
  keys: string | string[],
  UsedClass: InstantiatedClass,
  updateFunction?: InstantiateUpdateFunction | null
): T;
export default function instantiate<T extends object>(
  object: T,
  classes: Record<string, InstantiatedClass>,
  updateFunction?: InstantiateUpdateFunction | null
): T;
export default function instantiate(
  this: any,
  object: any,
  givenKeys: any,
  UsedClass?: any,
  givenUpdateFunction?: any
): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    givenUpdateFunction = UsedClass;
    UsedClass = givenKeys;
    givenKeys = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'instantiate');
  }

  const isKeysArray = Array.isArray(givenKeys);

  // allow to use key-class object
  if (typeof givenKeys === 'object' && !isKeysArray) {
    forOwn(givenKeys as Record<string, InstantiatedClass>, (objVal, objKey) =>
      instantiate(object, objKey, objVal, UsedClass)
    );
    return object;
  }

  // allow to use both single key and an array of keys
  const keys: string[] = isKeysArray ? givenKeys : [givenKeys];
  const updateFunction: InstantiateUpdateFunction = givenUpdateFunction || defaultUpdateFunction;
  const mediator = createInstantiateMediator({
    UsedClass,
    updateFunction
  });

  // iterate over all keys and define created mediator for all of them
  forEach(keys, (key) => mediate(object, key, mediator));

  return object;
}
