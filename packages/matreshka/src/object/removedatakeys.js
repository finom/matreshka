import defs from '../_core/defs';
import triggerOne from '../trigger/_triggerone';
import matreshkaError from '../_helpers/matreshkaerror';
import forEach from '../_helpers/foreach';

// removes given keys from a list of data keys
export default function removeDataKeys(givenKeys) {
  const def = defs.get(this);

  /* istanbul ignore if */
  if (!def) {
    return this;
  }

  const { keys } = def;
  let removedKeys;

  // accept an array keys or a list of args
  if (Array.isArray(givenKeys)) {
    removedKeys = givenKeys;
  } else {
    removedKeys = arguments;
  }

  forEach(removedKeys, (key) => {
    if (typeof key !== 'string') {
      throw matreshkaError('removedatakeys:key_type', { key });
    }

    if (key in keys) {
      const eventOptions = {
        key,
        value: this[key]
      };

      delete keys[key];

      // undelegate asterisk listeners from the value (the handler skips a value another data key holds)
      triggerOne(this, '_asterisk:remove', eventOptions);

      // fire "remove" and "modify" events
      triggerOne(this, 'remove', eventOptions);
      triggerOne(this, 'modify', eventOptions);
    }
  });

  return this;
}
