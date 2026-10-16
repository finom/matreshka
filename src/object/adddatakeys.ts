import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import forEach from '../_helpers/foreach.js';
import triggerOne from '../trigger/_triggerone.js';
import type { AnyObject, PropDef } from '../types.js';

// adds keys to a list of data keys
export default function addDataKeys<T extends AnyObject>(this: T, givenKeys: string | string[], ..._rest: string[]): T {
  const { keys } = initMK(this);

  let newKeys: ArrayLike<string>;

  // accept an array keys or a list of args
  if (Array.isArray(givenKeys)) {
    newKeys = givenKeys;
  } else {
    newKeys = arguments as ArrayLike<string>;
  }

  forEach(newKeys, (key) => {
    if (typeof key !== 'string') {
      throw matreshkaError('adddatakeys:key_type', { key });
    }

    // if key is not in a list of keys
    if (!(key in keys)) {
      // define descriptors for this property
      const { value } = defineProp(this, key) as PropDef;
      const eventOptions = { key, value };

      // add a key to the list of keys
      keys[key] = true;

      // delegate asterisk listeners to the current value
      triggerOne(this, '_asterisk:set', eventOptions);

      // trigger events which say that data is changed
      triggerOne(this, 'set', eventOptions);
      triggerOne(this, 'modify', eventOptions);
    }
  });

  return this;
}
