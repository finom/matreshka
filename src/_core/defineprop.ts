import type { AnyObject, PropDef } from '../types.js';
import initMK from './init.js';
import set from '../set.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import getProp from '../_helpers/getprop.js';
import hasOwn from '../_helpers/hasown.js';
import assign from '../_helpers/assign.js';

function errorAccessor(): never {
  throw matreshkaError('common:use_magic_props');
}

const libraryMarkers = ['isMatreshka', 'isMatreshkaArray', 'isMatreshkaObject'];

// a setter of the object or of a class it is made by (stops at the library's own prototypes)
function findSetter(object: AnyObject, key: string): PropertyDescriptor | undefined {
  for (
    let proto = Object.getPrototypeOf(object);
    proto && proto !== Object.prototype && !libraryMarkers.some((marker) => hasOwn(proto, marker));
    proto = Object.getPrototypeOf(proto)
  ) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor) return descriptor.set ? descriptor : undefined;
  }
  return undefined;
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
      value: getProp(object, key),
      mediator: null,
      bindings: null
    };
    // a setter (own or a class's) keeps running and gets each new value, and its getter gives the value;
    // a getter alone is replaced
    const accessor = descriptor
      ? descriptor.set
        ? descriptor
        : undefined
      : noAccessor
        ? undefined
        : findSetter(object, key);
    if (accessor) {
      propDef.accessor = { get: accessor.get, set: accessor.set };
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
          return setter ? setter() : set(object, key, v, assign({}, propDef.setterOptions, { fromSetter: true }));
        }
      });
    }
  }

  return def.props[key];
}
