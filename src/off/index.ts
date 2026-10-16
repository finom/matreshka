import type { AnyObject, EventEntry, EventHandler, ObjectDef } from '../types.js';
import type { DelegatedData, EventHandlerMap, EventNames } from '../on/types.js';
import splitBySpaceReg from '../on/_splitbyspaceregexp.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import forOwn from '../_helpers/forown.js';
import forEach from '../_helpers/foreach.js';
import defs from '../_core/defs.js';
import removeListener from './_removelistener.js';
import undelegateListener from './_undelegatelistener.js';
import triggerOne from '../trigger/_triggerone.js';
import { unlisten } from '../_dom/index.js';

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
    return Array.from(object as ArrayLike<any>);
  }

  if (name === '_asterisk:set') {
    return Object.keys(def.keys).map((key) => object[key]);
  }

  const key = delegatedKeyReg.exec(name)?.[1];

  return key === undefined ? null : [object[key]];
}

// removes listeners added by on/once/onDebounce and keeps the ones the framework adds (bindings, calc etc)
// every event list is split in one pass, so removing many listeners stays linear
function removeUserListeners(object: AnyObject, def: ObjectDef): void {
  const { events: allEvents, props } = def;
  const removed: RemoveEventData[] = [];
  const undelegations: { targets: any[]; delegatedData: DelegatedData }[] = [];
  const retained: { name: string; events: EventEntry[]; length: number; retain: EventEntry[] }[] = [];

  forOwn({ ...allEvents }, (events, name) => {
    const isDelegation = name.startsWith('_change:delegated:') || name.startsWith('_asterisk:');
    const retain: EventEntry[] = [];

    forEach(events, (event) => {
      const { info } = event;
      const isUserEvent = isDelegation ? info.delegatedData?.info.user : info.user;

      if (!isUserEvent) {
        retain.push(event);
      } else if (isDelegation) {
        const targets = getDelegationTargets(object, def, name);
        if (targets) {
          undelegations.push({ targets, delegatedData: info.delegatedData });
        }
      } else if (info.domEvent) {
        // bind:KEY and unbind:KEY share one domEvent, so it's handled once
        if (name.startsWith('bind:')) {
          const { domEvent } = info;
          const bindings = props[name.slice(5)]?.bindings;
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

  forEach(undelegations, ({ targets, delegatedData }) => {
    const { path, name, callback, context } = delegatedData;
    forEach(targets, (target) => {
      if (target && typeof target === 'object') {
        undelegateListener(target, path, name, callback, context, { delegated: true });
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

  if (!givenNames && !callback && !context) {
    if (def) {
      removeUserListeners(object, def);
    }

    return object;
  }

  // TODO: Array of names passed to off method is non-documented feature
  // split by spaces
  const names: string[] = isNamesVarArray ? givenNames : givenNames.split(splitBySpaceReg);

  forEach(names, (name) => {
    const delegatedEventParts = name.split('@');
    if (delegatedEventParts.length > 1) {
      const [path, delegatedName] = delegatedEventParts;
      undelegateListener(object, path, delegatedName, callback, context);
    } else {
      removeListener(object, name, callback, context);
    }
  });

  return object;
}
