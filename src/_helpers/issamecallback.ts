import type { EventHandler } from '../types.js';

type Callback = EventHandler & { _callback?: EventHandler };

// a wrapper made by once or onDebounce matches only itself; a user's function matches itself and its wrappers
export default function isSameCallback(given: Callback, existing: Callback): boolean {
  return given._callback ? given === existing : given === (existing._callback || existing);
}
