import defs from './defs';
import set from '../set';
import matreshkaError from '../_helpers/matreshkaerror';

function errorAccessor() {
  throw matreshkaError('common:use_magic_props');
}

// the function defines needed descriptor for given property
export default function defineProp(object, key, noAccessor) {
  const def = defs.get(object);

  // if no object definition do nothing
  if (!def) {
    return null;
  }

  if (!def.props[key]) {
    const propDef = {
      value: object[key],
      mediator: null,
      bindings: null
    };
    def.props[key] = propDef;
    let getter;
    let setter;
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
        set(v) {
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
