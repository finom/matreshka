import initMK from './_core/init';
import defineProp from './_core/defineprop';
import checkObjectType from './_helpers/checkobjecttype';
import forEach from './_helpers/foreach';
import set from './set';
import matreshkaError from './_helpers/matreshkaerror';
import forOwn from './_helpers/forown';

// creates property mediator
function createMediator({ object, propDef, key, mediator }) {
  return function propMediator(value) {
    // args: value, previousValue, key, object itself
    return mediator.call(object, value, propDef.value, key, object);
  };
}

// transforms property value on its changing
export default function mediate(object, givenKeys, mediator) {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    mediator = givenKeys;
    givenKeys = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'mediate');
  }

  const isKeysArray = Array.isArray(givenKeys);

  // allow to use key-mediator object as another method variation
  if (typeof givenKeys === 'object' && !isKeysArray) {
    forOwn(givenKeys, (objVal, objKey) => mediate(object, objKey, objVal));
    return object;
  }

  initMK(object);

  // allow to use both single key and an array of keys
  const keys = isKeysArray ? givenKeys : [givenKeys];

  forEach(keys, (key) => {
    // if non-string is passed as a key
    if (typeof key !== 'string') {
      throw matreshkaError('mediate:key_type', { key });
    }

    const propDef = defineProp(object, key);

    const propMediator = createMediator({
      object,
      propDef,
      key,
      mediator
    });
    propDef.mediator = propMediator;

    // set new value
    set(object, key, propMediator(propDef.value), {
      fromMediator: true
    });
  });

  return object;
}
