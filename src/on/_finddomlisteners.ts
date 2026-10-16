import type { EventEntry } from '../types.js';
import type { DomEventData } from './types.js';
import isSameCallback from '../_helpers/issamecallback.js';

// returns "_bind:KEY" events added by addDomListener which match given DOM event data
// selector, callback and context are compared only when they're given (or always if exact is true)
export default function findDomListeners(
  events: EventEntry[] | undefined,
  { eventName, selector, callback, context }: DomEventData,
  exact = false
): EventEntry[] {
  const result: EventEntry[] = [];

  if (!events) {
    return result;
  }

  const argCallback = callback?._callback || callback;

  for (let i = 0; i < events.length; i++) {
    const { domEvent } = events[i].info;

    if (domEvent && domEvent.eventName === eventName) {
      const eventCallback = domEvent.callback._callback || domEvent.callback;
      const selectorMatches = exact
        ? (domEvent.selector || null) === (selector || null)
        : !selector || selector === domEvent.selector;
      const callbackMatches = exact
        ? argCallback === eventCallback
        : !callback || isSameCallback(callback, domEvent.callback);
      const contextMatches = exact ? domEvent.context === context : !context || context === domEvent.context;

      if (selectorMatches && callbackMatches && contextMatches) {
        result.push(events[i]);
      }
    }
  }

  return result;
}
