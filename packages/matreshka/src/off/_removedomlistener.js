import defs from '../_core/defs';
import triggerOne from '../trigger/_triggerone';
import dom from '../_dom';
import forEach from '../_helpers/foreach';
import findDomListeners from '../on/_finddomlisteners';

// removes given events from an event list by identity
function removeEvents(allEvents, name, eventsToRemove) {
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
export default function removeDomListener(object, key, eventName, selector, callback, context) {
  const def = defs.get(object);

  if (!def) {
    return object;
  }

  const { events: allEvents, props } = def;
  const bindEventName = `bind:${key}`;
  const found = findDomListeners(allEvents[bindEventName], { eventName, selector, callback, context });

  if (!found.length) {
    return object;
  }

  const bindings = props[key]?.bindings;

  removeEvents(allEvents, bindEventName, found);
  removeEvents(allEvents, `unbind:${key}`, found);

  forEach(found, (event) => {
    const { domEvent } = event.info;

    if (bindings) {
      const nodes = bindings.map(({ node }) => node);
      dom.$(nodes).off(domEvent.fullEventName, domEvent.selector, domEvent.domEventHandler);
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
