import type { EventHandler } from './types.js';
import type { EventHandlerMap, EventNames } from './on/types.js';
import on from './on/index.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import debounce, { type Debounced } from './_helpers/debounce.js';
import forOwn from './_helpers/forown.js';

// adds debounced event listener
export default function onDebounce<T extends object>(
  object: T,
  names: EventNames,
  callback: EventHandler,
  delay?: number,
  triggerOnInit?: boolean,
  context?: any
): T;
// context and triggerOnInit can swap places
export default function onDebounce<T extends object>(
  object: T,
  names: EventNames,
  callback: EventHandler,
  delay: number | undefined,
  context: object,
  triggerOnInit?: boolean
): T;
export default function onDebounce<T extends object>(
  object: T,
  handlers: EventHandlerMap,
  delay?: number,
  triggerOnInit?: boolean,
  context?: any
): T;
export default function onDebounce<T extends object>(
  object: T,
  handlers: EventHandlerMap,
  delay: number | undefined,
  context: object,
  triggerOnInit?: boolean
): T;
export default function onDebounce(
  this: any,
  object: any,
  names: any,
  givenCallback?: any,
  givenDelay?: any,
  triggerOnInit?: any,
  context?: any
): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = triggerOnInit;
    triggerOnInit = givenDelay;
    givenDelay = givenCallback;
    givenCallback = names;
    names = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'onDebounce');
  }

  const isNamesVarArray = Array.isArray(names);

  // allow to pass name-handler object
  if (names && typeof names === 'object' && !isNamesVarArray) {
    forOwn(names as EventHandlerMap, (namesObjCallback, namesObjName) =>
      onDebounce(object, namesObjName, namesObjCallback, givenCallback, givenDelay, triggerOnInit)
    );

    return object;
  }

  const delay = typeof givenDelay === 'number' ? givenDelay : 0;

  const callback: Debounced<EventHandler> & { _callback?: EventHandler } = debounce(givenCallback, delay);

  // allow to remove event listener py passing original callback to "off"
  callback._callback = givenCallback;

  return on(object, names, callback, triggerOnInit, context);
}
