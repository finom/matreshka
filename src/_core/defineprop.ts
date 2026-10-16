import type { AnyObject, PropDef } from '../types.js';
import defs from './defs.js';
import set from '../set.js';
import matreshkaError from '../_helpers/matreshkaerror.js';

function errorAccessor(): never {
  throw matreshkaError('common:use_magic_props');
}

// the function defines needed descriptor for given property
export default function defineProp(object: AnyObject, key: string, noAccessor?: boolean): PropDef | null {
  const def = defs.get(object);

  // if no object definition do nothing
  if (!def) {
    return null;
  }

  if (!def.props[key]) {
    const propDef: PropDef = {
      value: object[key],
      mediator: null,
      bindings: null
    };
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
          return getter ? getter() : propDef.value;
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
