import type { AnyObject, EventEntry, EventHandler, ObjectDef } from '../types.js';
import type { DelegatedData, EventHandlerMap, EventNames } from '../on/types.js';
import splitNames, { splitDelegated } from '../on/_splitnames.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import forOwn from '../_helpers/forown.js';
import forEach from '../_helpers/foreach.js';
import defs from '../_core/defs.js';
import removeListener from './_removelistener.js';
import cancelIfGone from './_cancelifgone.js';
import undelegateListener from './_undelegatelistener.js';
import triggerOne from '../trigger/_triggerone.js';
import { unlisten } from '../_dom/index.js';
import { dropOwner, hasOwner } from '../on/_owners.js';
import isSameCallback from '../_helpers/issamecallback.js';
import getProp from '../_helpers/getprop.js';
import toArray from '../_helpers/toarray.js';
import assign from '../_helpers/assign.js';

const delegatedKeyReg = /^_change:delegated:(.*)$/;

// what removeevent handlers get
interface RemoveEventData {
  name: string;
  callback: EventHandler;
  context: any;
}

// returns objects which a delegated listener reaches through given delegation event name
function getDelegationTargets(object: AnyObject, def: ObjectDef, name: string): any[] | null {
  if (name === '_asterisk:add') {
    // the event lives on a Matreshka.Array
    return toArray(object as ArrayLike<any>);
  }

  if (name === '_asterisk:set') {
    return Object.keys(def.keys).map((key) => object[key]);
  }

  const key = delegatedKeyReg.exec(name)?.[1];

  return key === undefined ? null : [getProp(object, key)];
}

// the names on() was given for the object's own plain and DOM events
function userEventNames(def: ObjectDef): string[] {
  const names: string[] = [];
  const add = (name: string) => {
    if (names.indexOf(name) === -1) names.push(name);
  };
  forOwn(def.events, (events, name) => {
    if (name[0] !== '_') add(name);
    else if (name.indexOf('_bind:') === 0) forEach(events, ({ info }) => info.domEvent && add(info.domEvent.name));
  });
  return names;
}

// the delegated names ("a.b@x", "*@x") on() was given for this object, with the callback and context
function userDelegations(def: ObjectDef, callback?: EventHandler | null, context?: any): [string[], string][] {
  const found = new Map<string, [string[], string]>();
  forOwn(def.events, (events, name) => {
    const key = name === '_asterisk:add' || name === '_asterisk:set' ? '*' : delegatedKeyReg.exec(name)?.[1];
    if (key === undefined) return;
    forEach(events, (event) => {
      const { delegatedData, pathStr } = event.info;
      if (
        delegatedData.info.user &&
        hasOwner(event, null) &&
        (!callback || isSameCallback(callback, delegatedData.callback)) &&
        (!context || context === delegatedData.context)
      ) {
        const path = pathStr ? [key].concat(pathStr.split('.')) : [key];
        found.set(`${path.join('.')}@${delegatedData.name}`, [path, delegatedData.name]);
      }
    });
  });
  const result: [string[], string][] = [];
  found.forEach((value) => {
    result.push(value);
  });
  return result;
}

// removes listeners added by on/once/onDebounce and keeps the ones the framework adds (bindings, calc etc)
// every event list is split in one pass, so removing many listeners stays linear
function removeUserListeners(object: AnyObject, def: ObjectDef): void {
  const { events: allEvents, props } = def;
  const removed: RemoveEventData[] = [];
  const undelegations: { targets: any[]; delegatedData: DelegatedData }[] = [];
  const retained: { name: string; events: EventEntry[]; length: number; retain: EventEntry[] }[] = [];

  forOwn(assign({}, allEvents), (events, name) => {
    const isDelegation = name.indexOf('_change:delegated:') === 0 || name.indexOf('_asterisk:') === 0;
    const retain: EventEntry[] = [];

    forEach(events, (event) => {
      const { info } = event;
      const isUserEvent = isDelegation ? info.delegatedData?.info.user : info.user;

      // a listener a parent's delegation (or another owner) keeps stays; this object's own ownership goes
      if (!isUserEvent || !hasOwner(event, null) || !dropOwner(event, null)) {
        retain.push(event);
      } else if (isDelegation) {
        const targets = getDelegationTargets(object, def, name);
        if (targets) {
          undelegations.push({ targets, delegatedData: info.delegatedData });
        }
      } else if (info.domEvent) {
        // _bind:KEY and _unbind:KEY share one domEvent, so it's handled once
        if (name.indexOf('_bind:') === 0) {
          const { domEvent } = info;
          const bindings = props[name.slice(6)]?.bindings;
          if (bindings) {
            forEach(bindings, ({ node }) =>
              unlisten(node, domEvent.eventName, domEvent.selector, domEvent.domEventHandler)
            );
          }
          removed.push({ name: domEvent.name, callback: domEvent.callback, context: domEvent.context });
        }
      } else if (name[0] !== '_') {
        removed.push({ name, callback: event.callback, context: event.context });
      }
    });

    retained.push({ name, events, length: events.length, retain });
  });

  // removeevent fires before the lists change, so its own listeners hear it
  forEach(removed, (removeEventData) => {
    triggerOne(object, `removeevent:${removeEventData.name}`, removeEventData);
    triggerOne(object, 'removeevent', removeEventData);
  });

  forEach(retained, ({ name, events, length, retain }) => {
    // keep listeners which removeevent handlers have added meanwhile
    const current = allEvents[name] === events ? retain.concat(events.slice(length)) : retain;

    if (current.length) {
      allEvents[name] = current;
    } else {
      delete allEvents[name];
    }
  });

  // a pending onDebounce call doesn't fire after its listener is gone
  forEach(retained, ({ events, retain }) => {
    forEach(events, (event) => {
      if (retain.indexOf(event) === -1) {
        const { domEvent, delegatedData } = event.info;
        cancelIfGone(allEvents, domEvent ? domEvent.callback : delegatedData ? delegatedData.callback : event.callback);
      }
    });
  });

  forEach(undelegations, ({ targets, delegatedData }) => {
    const { path, name, callback, context, info } = delegatedData;
    forEach(targets, (target) => {
      if (target && typeof target === 'object') {
        undelegateListener(target, path, name, callback, context, info);
      }
    });
  });
}

// removes event listener
export default function off<T extends object>(
  object: T,
  names?: EventNames | null,
  callback?: EventHandler | null,
  context?: any
): T;
export default function off<T extends object>(object: T, handlers: EventHandlerMap, context?: any): T;
export default function off(this: any, object: any, givenNames?: any, callback?: any, context?: any): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    context = callback;
    callback = givenNames;
    givenNames = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'off');
  }

  const isNamesVarArray = Array.isArray(givenNames);
  const def = defs.get(object);

  // allow to pass name-handler object
  // TODO: Name-handler object passed to off method is non-documented feature
  if (givenNames && typeof givenNames === 'object' && !isNamesVarArray) {
    forOwn(givenNames as EventHandlerMap, (namesObjCallback, namesObjName) =>
      off(object, namesObjName, namesObjCallback, callback)
    );
    return object;
  }

  // an object without a definition has no listeners
  if (!def) {
    return object;
  }

  if (!givenNames && !callback && !context) {
    removeUserListeners(object, def);
    return object;
  }

  // TODO: Array of names passed to off method is non-documented feature
  // split by spaces
  // no names with a callback or a context: every plain and DOM event of the object
  const names: string[] = isNamesVarArray ? givenNames : givenNames ? splitNames(givenNames) : userEventNames(def);

  // no names: the delegated events too
  if (!givenNames) {
    forEach(userDelegations(def, callback, context), ([path, delegatedName]) =>
      undelegateListener(object, path, delegatedName, callback, context)
    );
  }

  forEach(names, (name) => {
    const delegated = splitDelegated(name);
    if (delegated) {
      const [path, delegatedName] = delegated;
      undelegateListener(object, path, delegatedName, callback, context);
    } else {
      removeListener(object, name, callback, context);
    }
  });

  return object;
}
