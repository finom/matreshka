// returns "bind:KEY" events added by addDomListener which match given DOM event data
// selector, callback and context are compared only when they're given (or always if exact is true)
export default function findDomListeners(events, { eventName, selector, callback, context }, exact = false) {
  const result = [];

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
      const callbackMatches = exact ? argCallback === eventCallback : !argCallback || argCallback === eventCallback;
      const contextMatches = exact ? domEvent.context === context : !context || context === domEvent.context;

      if (selectorMatches && callbackMatches && contextMatches) {
        result.push(events[i]);
      }
    }
  }

  return result;
}
