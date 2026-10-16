import checkObjectType from './_helpers/checkobjecttype';
import forOwn from './_helpers/forown';
import forEach from './_helpers/foreach';
import assign from './_helpers/assign';
import mediate from './mediate';

// the function is used when no update function is given
function defaultUpdateFunction(instance, data) {
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
function createInstantiateMediator({ UsedClass, updateFunction }) {
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
export default function instantiate(object, givenKeys, UsedClass, givenUpdateFunction) {
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
    forOwn(givenKeys, (objVal, objKey) => instantiate(object, objKey, objVal, UsedClass));
    return object;
  }

  // allow to use both single key and an array of keys
  const keys = isKeysArray ? givenKeys : [givenKeys];
  const updateFunction = givenUpdateFunction || defaultUpdateFunction;
  const mediator = createInstantiateMediator({
    UsedClass,
    updateFunction
  });

  // iterate over all keys and define created mediator for all of them
  forEach(keys, (key) => mediate(object, key, mediator));

  return object;
}
