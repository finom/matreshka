import type { EventOptions } from './types.js';
import unbindNode from './unbindnode/index.js';
import triggerOne from './trigger/_triggerone.js';
import removeListener from './off/_removelistener.js';
import defs from './_core/defs.js';
import deepBindings from './bindnode/_deepbindings.js';
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

    // a property Matreshka doesn't track is simply deleted, and still announced
    if (!propDef) {
      const existed = Object.hasOwn(object, key);
      const value = object[key];
      delete object[key];
      if (def && existed && !silent) {
        const extendedEventOptions = { key, value, ...eventOptions };
        triggerOne(object, 'delete', extendedEventOptions);
        triggerOne(object, `delete:${key}`, extendedEventOptions);
      }
      continue;
    }

    const { value } = propDef;

    // remove all bindings, deep ones under the key ("a.b" for "a") too
    unbindNode(object, key);
    forEach(deepBindings.get(object)?.filter(({ deepPath }) => deepPath[0] === key) ?? [], (deepBinding) =>
      unbindNode(object, deepBinding.key)
    );

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
      'unbind',
      '_bind',
      '_unbind'
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
