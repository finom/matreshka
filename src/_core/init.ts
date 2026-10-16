import type { AnyObject, ObjectDef } from '../types.js';
import defs from './defs.js';

let objectId = 0;

// this is common function which associates an object with its Matreshka definition
export default function initMK(object: AnyObject): ObjectDef {
  let def = defs.get(object);
  if (!def) {
    def = {
      // a property name of "events" object is an event name
      // and a value is an array of event handlers
      events: {
        /* example: {
                    callback: function,
                    ctx: object,
                    context: object2,
                    name: "example",
                    info: { ...extra data for an event... }
                } */
      },
      // "props" contains special information about properties (getters, setters etc)
      props: {
        /* example: {
                    value: object[key],
                    mediator: null,
                    bindings: [{
                        node,
                        binder,
                        nodeHandler,
                        objectHandler,
                        ...other required info
                    }]
                } */
      },
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
