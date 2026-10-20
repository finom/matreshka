import type { AnyObject, EventEntry, ObjectDef } from '../types.js';
import triggerOne from '../trigger/_triggerone.js';
import { unlisten } from '../_dom/index.js';
import forEach from '../_helpers/foreach.js';
import findDomListeners from '../on/_finddomlisteners.js';
import { dropOwner, hasOwner, type Owner } from '../on/_owners.js';
import cancelIfGone from './_cancelifgone.js';

// drops the owner from the entries of an event list that carry one of given DOM listeners;
// removes the entries nobody keeps any more
function dropDomOwner(allEvents: Record<string, EventEntry[]>, name: string, domEvents: any[], owner: Owner): void {
  const events = allEvents[name];

  if (!events) {
    return;
  }

  // _bind:KEY and _unbind:KEY entries of one listener share its domEvent
  const retain = events.filter((event) => domEvents.indexOf(event.info.domEvent) === -1 || !dropOwner(event, owner));

  if (retain.length) {
    allEvents[name] = retain;
  } else {
    delete allEvents[name];
  }
}

// removes dom listener from nodes bound to given key
// a delegation passes its owner and removes only the listener it added, the one nobody else keeps
export default function removeDomListener(
  object: AnyObject,
  def: ObjectDef,
  key: string,
  eventName: string,
  selector?: string,
  callback?: EventEntry['callback'] | null,
  context?: any,
  owner: Owner = null
): AnyObject {
  const { events: allEvents, props } = def;
  const bindEventName = `_bind:${key}`;
  const domEvents = findDomListeners(allEvents[bindEventName], { eventName, selector, callback, context }, !!owner)
    .filter((event) => hasOwner(event, owner))
    .map((event) => event.info.domEvent);

  if (!domEvents.length) {
    return object;
  }

  dropDomOwner(allEvents, bindEventName, domEvents, owner);
  dropDomOwner(allEvents, `_unbind:${key}`, domEvents, owner);

  // the listeners still kept by somebody else stay
  const kept = (allEvents[bindEventName] || []).map((event) => event.info.domEvent);
  const bindings = props[key]?.bindings;

  forEach(domEvents, (domEvent) => {
    if (kept.indexOf(domEvent) !== -1) {
      return;
    }

    if (bindings) {
      forEach(bindings, ({ node }) => unlisten(node, domEvent.eventName, domEvent.selector, domEvent.domEventHandler));
    }

    if (!owner) {
      cancelIfGone(allEvents, domEvent.callback);
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
