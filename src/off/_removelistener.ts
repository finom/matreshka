import type { AnyObject, EventEntry, ObjectDef } from '../types.js';
import defs from '../_core/defs.js';
import triggerOne from '../trigger/_triggerone.js';
import domEventReg from '../on/_domeventregexp.js';
import forEach from '../_helpers/foreach.js';
import forOwn from '../_helpers/forown.js';
import removeDomListener from './_removedomlistener.js';
import isSameCallback from '../_helpers/issamecallback.js';
import { dropOwner, hasOwner, type Owner } from '../on/_owners.js';
import cancelIfGone from './_cancelifgone.js';

// removes simple event listener from an object
export default function removeListener(
  object: AnyObject,
  name?: string,
  callback?: EventEntry['callback'] | null,
  context?: any,
  info?: Record<string, any>
): boolean {
  // every caller passes an object that has listeners
  const def = defs.get(object) as ObjectDef;

  const { events: allEvents } = def;
  const events = name === undefined ? undefined : allEvents[name];
  const retain: EventEntry[] = [];
  const domEventExecResult = name === undefined ? null : domEventReg.exec(name);
  // a delegation removes only its own listener, the one it added with this callback and context
  const owner: Owner = info?.owner ?? null;

  if (domEventExecResult) {
    const [, eventName, key = 'sandbox', selector] = domEventExecResult;
    removeDomListener(object, def, key, eventName, selector, callback, context, owner);

    return true;
  }

  // if all events need to be removed
  if (typeof name === 'undefined') {
    forOwn(allEvents, (allEventsItem, allEventsName) => {
      forEach(allEventsItem, (event) => {
        const removeEventData = {
          name: allEventsName,
          callback: event.callback,
          context: event.context
        };

        triggerOne(object, `removeevent:${allEventsName}`, removeEventData);
        triggerOne(object, 'removeevent', removeEventData);
      });
    });

    // restore default value of "events"
    def.events = Object.create(null);
  } else if (events) {
    const removed: { name: string; callback: EventEntry['callback']; context: any }[] = [];
    const matches = (event: EventEntry) =>
      owner
        ? event.callback === callback && event.context === context
        : (!callback || isSameCallback(callback, event.callback)) && (!context || context === event.context);

    // if events with given name are found
    forEach(events, (event) => {
      if (!matches(event) || !hasOwner(event, owner) || !dropOwner(event, owner)) {
        // kept: another listener, or one somebody else still keeps
        retain.push(event);
      } else {
        removed.push({ name, callback: event.callback, context: event.context });
      }
    });

    if (retain.length) {
      allEvents[name] = retain;
    } else {
      delete allEvents[name];
    }

    // a delegation that goes from one object keeps a call pending from another one
    if (!owner) {
      forEach(removed, ({ callback: removedCallback }) => cancelIfGone(allEvents, removedCallback));
    }

    // after the list changes: a handler that calls off() or on() for the same name sees the listener gone
    if (name[0] !== '_') {
      forEach(removed, (removeEventData) => {
        triggerOne(object, `removeevent:${name}`, removeEventData);
        triggerOne(object, 'removeevent', removeEventData);
      });
    }
  }

  return false;
}
