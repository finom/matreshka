import type { EventOptions } from './types.js';
import unbindNode from './unbindnode/index.js';
import triggerOne from './trigger/_triggerone.js';
import removeListener from './off/_removelistener.js';
import defs from './_core/defs.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import matreshkaError from './_helpers/matreshkaerror.js';
import forEach from './_helpers/foreach.js';

// removes a property, its bindings and its events
export default function remove<T extends object>(object: T, key: string | string[], eventOptions?: EventOptions): T;
export default function remove(this: any, object: any, givenKey: any, eventOptions?: any): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = givenKey;
    givenKey = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'remove');
  }

  eventOptions = (eventOptions || {}) as EventOptions;
  const def = defs.get(object);
  const { silent } = eventOptions;
  // allow to pass single key or an array of keys
  const keys: unknown[] = Array.isArray(givenKey) ? givenKey : [givenKey];

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // if non-string is passed as a key
    if (typeof key !== 'string') {
      throw matreshkaError('remove:key_type', { key });
    }

    const props = def?.props;
    const propDef = props?.[key];

    // if no object definition then simply delete the property
    if (!propDef) {
      delete object[key];
      continue;
    }

    const { value } = propDef;

    // remove all bindings
    unbindNode(object, key);

    // undelegate delegated and tree listeners (a.b@event, calc on "a.b") from the removed value
    // (unless another property still holds it: delegated listeners on one object are shared)
    if (value && typeof value === 'object' && !Object.keys(props).some((k) => k !== key && props[k].value === value)) {
      triggerOne(object, `_change:delegated:${key}`, { key, value: undefined, previousValue: value });
    }

    // TODO: Manual listing of event prefixes may cause problems in future
    const removeEventPrefies = [
      '_change:deps',
      '_change:bindings',
      '_change:delegated',
      '_change:tree',
      'change',
      'beforechange',
      'bind',
      'unbind'
    ];

    // remove all events
    forEach(removeEventPrefies, (prefix) => removeListener(object, `${prefix}:${key}`));

    // delete property definition
    delete props[key];

    // delete the property itself
    delete object[key];

    const extendedEventOptions = {
      key,
      value,
      ...eventOptions
    };

    // trigger delegated events logic removal for asterisk events (*.*.*@foo)
    triggerOne(object, '_delete:delegated', extendedEventOptions);

    // fire events if "silent" is not true
    if (!silent) {
      triggerOne(object, 'delete', extendedEventOptions);
      triggerOne(object, `delete:${key}`, extendedEventOptions);
    }
  }

  return object;
}
