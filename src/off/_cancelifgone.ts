import type { EventEntry } from '../types.js';

// a pending onDebounce call doesn't fire once its listener is gone from the object:
// from every plain, DOM and delegated event of it
export default function cancelIfGone(allEvents: Record<string, EventEntry[]>, callback: EventEntry['callback']): void {
  for (const name in allEvents) {
    if (
      allEvents[name].some(
        ({ callback: existing, info }) =>
          existing === callback || info.domEvent?.callback === callback || info.delegatedData?.callback === callback
      )
    ) {
      return;
    }
  }
  (callback as { cancel?: () => void }).cancel?.();
}
