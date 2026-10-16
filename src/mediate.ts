import type { AnyObject, Mediator, PropDef } from './types.js';
import initMK from './_core/init.js';
import defineProp from './_core/defineprop.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import forEach from './_helpers/foreach.js';
import set from './set.js';
import matreshkaError from './_helpers/matreshkaerror.js';
import forOwn from './_helpers/forown.js';

// creates property mediator
function createMediator({
  object,
  propDef,
  key,
  mediator
}: {
  object: AnyObject;
  propDef: PropDef;
  key: string;
  mediator: Mediator;
}): (value: any) => any {
  return function propMediator(value: any) {
    // args: value, previousValue, key, object itself
    return mediator.call(object, value, propDef.value, key, object);
  };
}

// transforms property value on its changing
export default function mediate<T extends object>(object: T, keys: string | string[], mediator: Mediator): T;
export default function mediate<T extends object>(object: T, mediators: Record<string, Mediator>): T;
export default function mediate(this: any, object: any, givenKeys: any, mediator?: any): any {
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
    forOwn(givenKeys as Record<string, Mediator>, (objVal, objKey) => mediate(object, objKey, objVal));
    return object;
  }

  initMK(object);

  // allow to use both single key and an array of keys
  const keys: unknown[] = isKeysArray ? givenKeys : [givenKeys];

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
