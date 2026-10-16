import type { EventHandler } from './types.js';
import type { EventHandlerMap, EventNames } from './on/types.js';
import on from './on/index.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import forOwn from './_helpers/forown.js';
import off from './off/index.js';
import apply from './_helpers/apply.js';

// adds event listener which will be removed immediately after its first call
export default function once<T extends object>(object: T, names: EventNames, callback: EventHandler, context?: any): T;
export default function once<T extends object>(object: T, handlers: EventHandlerMap, context?: any): T;
export default function once(this: any, object: any, names: any, givenCallback?: any, context?: any): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = givenCallback;
    givenCallback = names;
    names = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'once');
  }

  const isNamesVarArray = Array.isArray(names);

  // allow to pass name-handler object
  if (names && typeof names === 'object' && !isNamesVarArray) {
    forOwn(names as EventHandlerMap, (namesObjCallback, namesObjName) =>
      once(object, namesObjName, namesObjCallback, givenCallback)
    );
    return object;
  }

  const callback = function onceCallback(this: any) {
    // remove event listener before its call, so the handler can fire its own event again
    off(object, names, onceCallback, context);
    apply(givenCallback, this, arguments);
  };

  // allow to remove event listener py passing original callback to "off"
  callback._callback = givenCallback;

  return on(object, names, callback, context);
}
