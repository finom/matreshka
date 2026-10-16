import type { EventEntry, EventHandler } from '../../types.js';
import isSameCallback from '../../_helpers/issamecallback.js';

// what identifies a delegated listener
export interface Delegation {
  pathStr: string;
  name: string;
  callback?: (EventHandler & { _callback?: EventHandler }) | null;
  context?: any;
}

// tells whether an internal delegation event (like "_change:delegated:KEY") belongs to a delegated listener
// callback and context are compared only when they're given, or always when exact is true
export default function matchesDelegation(
  event: EventEntry,
  { pathStr, name, callback, context }: Delegation,
  exact = false
): boolean {
  const { pathStr: eventPathStr, delegatedData } = event.info;

  if (eventPathStr !== pathStr || !delegatedData || delegatedData.name !== name) {
    return false;
  }

  const argCallback = callback?._callback || callback;
  const eventCallback = delegatedData.callback?._callback || delegatedData.callback;

  if (exact) {
    return argCallback === eventCallback && delegatedData.context === context;
  }

  return (
    (!callback || isSameCallback(callback, delegatedData.callback)) && (!context || context === delegatedData.context)
  );
}
