import type { AnyObject, EventEntry, ObjectDef } from '../types.js';
import defs from '../_core/defs.js';
import triggerOne from '../trigger/_triggerone.js';
import domEventReg from '../on/_domeventregexp.js';
import forEach from '../_helpers/foreach.js';
import forOwn from '../_helpers/forown.js';
import removeDomListener from './_removedomlistener.js';
import isSameCallback from '../_helpers/issamecallback.js';

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

  if (domEventExecResult) {
    const [, eventName, key = 'sandbox', selector] = domEventExecResult;
    removeDomListener(object, def, key, eventName, selector, callback, context);

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

    // if events with given name are found
    forEach(events, (event) => {
      const owner = info?.delegated ? 'byDelegation' : 'byDirect';
      const otherOwner = info?.delegated ? 'byDirect' : 'byDelegation';

      if ((callback && !isSameCallback(callback, event.callback)) || (context && context !== event.context)) {
        // keep event
        retain.push(event);
      } else if (event.info[otherOwner]) {
        // the listener is still used by the other kind of listener
        event.info = { ...event.info, [owner]: false };
        retain.push(event);
      } else {
        // a pending onDebounce call doesn't fire after its listener is gone
        (event.callback as { cancel?: () => void }).cancel?.();
        removed.push({ name, callback: event.callback, context: event.context });
      }
    });

    if (retain.length) {
      allEvents[name] = retain;
    } else {
      delete allEvents[name];
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
