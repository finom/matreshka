import type { AnyObject, PropDef } from '../types.js';
import initMK from './init.js';
import set from '../set.js';
import matreshkaError from '../_helpers/matreshkaerror.js';

function errorAccessor(): never {
  throw matreshkaError('common:use_magic_props');
}

// the function defines needed descriptor for given property
export default function defineProp(object: AnyObject, key: string, noAccessor?: boolean): PropDef {
  const def = initMK(object);

  if (!def.props[key]) {
    const descriptor = noAccessor ? undefined : Object.getOwnPropertyDescriptor(object, key);

    if (descriptor && !descriptor.configurable) {
      throw matreshkaError('common:not_configurable', { key });
    }

    const propDef: PropDef = {
      value: object[key],
      mediator: null,
      bindings: null
    };
    // an own setter keeps running and gets each new value, and its getter gives the value; a getter alone is replaced
    if (descriptor?.set) {
      propDef.accessor = { get: descriptor.get, set: descriptor.set };
    }
    def.props[key] = propDef;
    let getter: (() => any) | undefined;
    let setter: (() => any) | undefined;
    // sandbox (for all objects) and container (for Matreshka.Array instances) throw on get and on set,
    // so they are hidden from Object.keys and JSON.stringify
    const isReserved = key === 'sandbox' || (object.isMatreshkaArray && key === 'container');

    if (isReserved) {
      getter = errorAccessor;
      setter = errorAccessor;
    }

    if (!noAccessor) {
      Object.defineProperty(object, key, {
        configurable: true,
        enumerable: !isReserved,
        get() {
          if (getter) return getter();
          return propDef.accessor?.get ? propDef.accessor.get.call(object) : propDef.value;
        },
        set(v: any) {
          return setter
            ? setter()
            : set(object, key, v, {
                fromSetter: true
              });
        }
      });
    }
  }

  return def.props[key];
}
