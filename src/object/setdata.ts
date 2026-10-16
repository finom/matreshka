import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import forOwn from '../_helpers/forown.js';
import set from '../set.js';
import is from '../_helpers/is.js';
import forEach from '../_helpers/foreach.js';
import triggerOne from '../trigger/_triggerone.js';
import type { AnyObject, EventOptions } from '../types.js';

// returns an array of keys listed at inObject but not listed at fromObject
function getNotListedKeys(inObject: Record<string, any>, fromObject: object): string[] {
  const result: string[] = [];
  forOwn(inObject, (_, key) => {
    if (!Object.hasOwn(fromObject, key)) {
      result.push(key);
    }
  });

  return result;
}

// removes data keys; "silent" skips remove and modify, as remove() does
function removeKeys(object: AnyObject, keys: Record<string, any>, removed: string[], silent?: boolean): void {
  forEach(removed, (key) => {
    const eventOptions = { key, value: object[key] };
    delete keys[key];
    triggerOne(object, '_asterisk:remove', eventOptions);
    if (!silent) {
      triggerOne(object, 'remove', eventOptions);
      triggerOne(object, 'modify', eventOptions);
    }
  });
}

// makes a key a data key and sets its value; a value the key already holds still becomes data, as addDataKeys does
function setOne(object: AnyObject, keys: Record<string, any>, key: string, value: any, eventOptions: EventOptions) {
  const isNew = !(key in keys);
  defineProp(object, key);
  keys[key] = 1;

  if (isNew && is(object[key], value)) {
    const extendedEventOptions = { ...eventOptions, key, value };
    triggerOne(object, '_asterisk:set', extendedEventOptions);
    // with force, set() fires them itself
    if (!eventOptions.silent && !eventOptions.force) {
      triggerOne(object, 'set', extendedEventOptions);
      triggerOne(object, 'modify', extendedEventOptions);
    }
  }

  return set(object, key, value, eventOptions);
}

// changes property value and adds given key to a list of data keys
export default function setData<T extends AnyObject>(
  this: T,
  key: string | Record<string, any>,
  value?: any,
  eventOptions?: EventOptions
): T {
  // if no key or falsy key is given
  if (!key) {
    return this;
  }

  const { keys } = initMK(this);

  // allow to pass key-value object
  if (typeof key === 'object') {
    eventOptions = (value || {}) as EventOptions;
    // a Matreshka.Object gives its data, not its own fields such as nodes
    const data: Record<string, any> = key.isMatreshkaObject ? Object.fromEntries(key.entries()) : key;

    // remove data keys not listed at key-value object
    if (eventOptions.replaceData) {
      removeKeys(this, keys, getNotListedKeys(keys, data), eventOptions.silent);
    }

    forOwn(data, (objVal, objKey) => {
      setOne(this, keys, objKey, objVal, eventOptions as EventOptions);
    });

    return this;
  }

  eventOptions = eventOptions || {};

  // remove all data keys except given key
  if (eventOptions.replaceData) {
    removeKeys(this, keys, getNotListedKeys(keys, { [key]: true }), eventOptions.silent);
  }

  return setOne(this, keys, key, value, eventOptions);
}
