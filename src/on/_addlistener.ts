import type { AnyObject, EventEntry, EventHandler } from '../types.js';
import initMK from '../_core/init.js';
import triggerOne from '../trigger/_triggerone.js';
import defineProp from '../_core/defineprop.js';
import domEventReg from './_domeventregexp.js';
import addDomListener from './_adddomlistener.js';

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
  const event: EventEntry = {
    callback,
    context,
    ctx,
    name,
    info: name[0] === '_' ? info : { ...info, [info.delegated ? 'byDelegation' : 'byDirect']: true }
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
        const argCallback: EventHandler | undefined = callback?._callback || callback;
        const eventCallback = existingEvent.callback._callback || existingEvent.callback;
        if (argCallback === eventCallback && existingEvent.context === context) {
          // the listener is kept until both a direct listener and a delegated one using it are removed
          if (name[0] !== '_') {
            existingEvent.info = { ...existingEvent.info, [info.delegated ? 'byDelegation' : 'byDirect']: true };
          }
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
