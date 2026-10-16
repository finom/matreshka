import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import forOwn from '../_helpers/forown.js';
import set from '../set.js';
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

    const { replaceData } = eventOptions;

    // remove data keys not listed at key-value object
    if (replaceData) {
      const notListedKeys = getNotListedKeys(keys, key);

      if (notListedKeys.length) {
        this.removeDataKeys(notListedKeys);
      }
    }

    // do not call setData recursivally for better performance
    forOwn(key, (objVal, objKey) => {
      // define descriptors for given property
      defineProp(this, objKey);

      // add a key to a list of keys
      keys[objKey] = 1;

      // do other things with set method
      set(this, objKey, objVal, eventOptions);
    });

    return this;
  }

  eventOptions = eventOptions || {};

  const { replaceData } = eventOptions;

  // remove all data keys except given key
  if (replaceData) {
    const notListedKeys = getNotListedKeys(keys, { [key]: true });

    if (notListedKeys.length) {
      this.removeDataKeys(notListedKeys);
    }
  }

  // define descriptors for given property
  defineProp(this, key);

  // add a key to a list of keys
  keys[key] = 1;

  // do other things with set method
  return set(this, key, value, eventOptions);
}
