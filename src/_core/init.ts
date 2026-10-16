import type { AnyObject, ObjectDef } from '../types.js';
import defs from './defs.js';

let objectId = 0;

// this is common function which associates an object with its Matreshka definition
export default function initMK(object: AnyObject): ObjectDef {
  let def = defs.get(object);
  if (!def) {
    def = {
      // event name -> handlers; property name -> getters, setters, bindings. Null prototypes, so a key
      // named `__proto__` or `toString` is a key like any other
      events: Object.create(null),
      props: Object.create(null),
      id: objectId
    };

    objectId += 1;

    defs.set(object, def);

    if (object._afterInit) {
      object._afterInit(def);
    }
  }

  return def;
}
