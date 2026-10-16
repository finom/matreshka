import type { AnyObject, EventEntry } from '../types.js';
import defs from '../_core/defs.js';
import triggerOne from '../trigger/_triggerone.js';
import { unlisten } from '../_dom/index.js';
import forEach from '../_helpers/foreach.js';
import findDomListeners from '../on/_finddomlisteners.js';

// removes given events from an event list by identity
function removeEvents(allEvents: Record<string, EventEntry[]>, name: string, eventsToRemove: EventEntry[]): void {
  const events = allEvents[name];

  if (!events) {
    return;
  }

  const retain = events.filter((event) => !eventsToRemove.some(({ info }) => info === event.info));

  if (retain.length) {
    allEvents[name] = retain;
  } else {
    delete allEvents[name];
  }
}

// removes dom listener from nodes bound to given key
export default function removeDomListener(
  object: AnyObject,
  key: string,
  eventName: string,
  selector?: string,
  callback?: EventEntry['callback'] | null,
  context?: any
): AnyObject {
  const def = defs.get(object);

  if (!def) {
    return object;
  }

  const { events: allEvents, props } = def;
  const bindEventName = `_bind:${key}`;
  const found = findDomListeners(allEvents[bindEventName], { eventName, selector, callback, context });

  if (!found.length) {
    return object;
  }

  const bindings = props[key]?.bindings;

  removeEvents(allEvents, bindEventName, found);
  removeEvents(allEvents, `_unbind:${key}`, found);

  forEach(found, (event) => {
    const { domEvent } = event.info;

    if (bindings) {
      forEach(bindings, ({ node }) => unlisten(node, domEvent.eventName, domEvent.selector, domEvent.domEventHandler));
    }

    const removeEventData = {
      name: domEvent.name,
      callback: domEvent.callback,
      context: domEvent.context
    };

    triggerOne(object, `removeevent:${domEvent.name}`, removeEventData);
    triggerOne(object, 'removeevent', removeEventData);
  });

  return object;
}
