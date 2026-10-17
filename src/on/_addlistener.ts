import type { AnyObject, EventEntry } from '../types.js';
import initMK from '../_core/init.js';
import triggerOne from '../trigger/_triggerone.js';
import defineProp from '../_core/defineprop.js';
import domEventReg from './_domeventregexp.js';
import addDomListener from './_adddomlistener.js';
import { addOwner, type Owner } from './_owners.js';
import { isDuplicateCallback } from '../_helpers/issamecallback.js';

// property modifier event regexp
const propModEventReg =
  /^_change:deps:|^_change:bindings:|^_change:delegated:|^_change:common:|^_change:tree:|^change:|^beforechange:/;

// adds simple event listener
// used as core of event engine
export default function addListener(
  object: AnyObject,
  name: string,
  callback: EventEntry['callback'],
  context?: any,
  info: Record<string, any> = {}
): boolean {
  const { events: allEvents } = initMK(object);
  const ctx = context || object;
  const events = allEvents[name];
  // a delegation passes its owner; the internal events of a delegation pass their owners list
  const owner: Owner = info.owner ?? null;
  const event: EventEntry = {
    callback,
    context,
    ctx,
    name,
    info: { owners: [owner], ...info }
  };
  // skipChecks is used by internal methods for better performance
  const { skipChecks = false } = info;

  if (!skipChecks) {
    const domEventExecResult = domEventReg.exec(name);

    if (domEventExecResult) {
      const [, eventName, key = 'sandbox', selector] = domEventExecResult;
      const isAdded = addDomListener(object, key, eventName, selector, callback, context, info, name);

      if (isAdded) {
        triggerOne(object, `addevent:${name}`, event);
        triggerOne(object, 'addevent', event);
      }

      return isAdded;
    }
  }

  // if there are events with the same name
  if (events) {
    if (!skipChecks) {
      // if there are events with the same data, return false
      for (let i = 0; i < events.length; i++) {
        const existingEvent = events[i];
        if (isDuplicateCallback(callback, existingEvent.callback) && existingEvent.context === context) {
          // the listener is kept until everyone who added it removes it
          addOwner(existingEvent, owner);
          return false;
        }
      }
    }

    // if the event isn't found add it to the event list
    events.push(event);
  } else {
    // if there are no events with the same name, create an array with only  one event
    allEvents[name] = [event];
  }

  if (propModEventReg.test(name)) {
    // define needed accessors for KEY
    defineProp(object, name.replace(propModEventReg, ''));
  }

  // names prefixed by underscore mean "private" events
  if (!skipChecks && name[0] !== '_') {
    triggerOne(object, `addevent:${name}`, event);
    triggerOne(object, 'addevent', event);
  }

  // if event is added successfully return true
  return true;
}
