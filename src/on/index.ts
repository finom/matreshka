import type { EventHandler } from '../types.js';
import type { EventHandlerMap, EventNames } from './types.js';
import splitBySpaceReg from './_splitbyspaceregexp.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import forOwn from '../_helpers/forown.js';
import forEach from '../_helpers/foreach.js';
import addListener from './_addlistener.js';
import delegateListener from './_delegatelistener/index.js';

// adds event listener
export default function on<T extends object>(
  object: T,
  names: EventNames,
  callback: EventHandler,
  triggerOnInit?: boolean,
  context?: any
): T;
// context and triggerOnInit can swap places
export default function on<T extends object>(
  object: T,
  names: EventNames,
  callback: EventHandler,
  context: object,
  triggerOnInit?: boolean
): T;
export default function on<T extends object>(
  object: T,
  handlers: EventHandlerMap,
  triggerOnInit?: boolean,
  context?: any
): T;
export default function on<T extends object>(
  object: T,
  handlers: EventHandlerMap,
  context: object,
  triggerOnInit?: boolean
): T;
export default function on(
  this: any,
  object: any,
  givenNames?: any,
  callback?: any,
  triggerOnInit?: any,
  context?: any
): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = triggerOnInit;
    triggerOnInit = callback;
    callback = givenNames;
    givenNames = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'on');
  }

  const isNamesVarArray = Array.isArray(givenNames);

  // allow to pass name-handler object
  if (givenNames && typeof givenNames === 'object' && !isNamesVarArray) {
    forOwn(givenNames as EventHandlerMap, (namesObjCallback, namesObjName) =>
      on(object, namesObjName, namesObjCallback, callback, triggerOnInit)
    );
    return object;
  }

  if (typeof givenNames !== 'string' && !isNamesVarArray) {
    throw matreshkaError('on:names_type', { names: givenNames });
  }

  // split by spaces
  // TODO: Array of names passed to on method is non-documented feature
  const names: string[] = isNamesVarArray ? givenNames : givenNames.split(splitBySpaceReg);

  // flip triggerOnInit and context when triggerOnInit is not boolean
  if (typeof triggerOnInit !== 'boolean' && typeof triggerOnInit !== 'undefined') {
    [context, triggerOnInit] = [triggerOnInit, context];
  }

  forEach(names, (name) => {
    // "user" tells off() with no args which listeners to remove (it keeps the framework's own)
    const info = { user: true };
    const delegatedEventParts = name.split('@');

    if (delegatedEventParts.length > 1) {
      // if @ exists in event name then this is delegated event
      const [path, delegatedName] = delegatedEventParts;
      delegateListener(object, path, delegatedName, callback, context || object, info);
    } else {
      // if not, this is simple event
      addListener(object, name, callback, context, info);
    }
  });

  // call callback immediatelly if triggerOnInit is true
  if (triggerOnInit === true) {
    callback.call(context || object, { triggerOnInit });
  }

  return object;
}
