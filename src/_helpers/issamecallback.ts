import type { EventHandler } from '../types.js';

// once, onDebounce and tree listeners wrap a function: _callback is the function, _kind the wrapper
type Callback = EventHandler & { _callback?: EventHandler; _kind?: string };

// a wrapper made by once or onDebounce matches only itself; a user's function matches itself and its wrappers
export default function isSameCallback(given: Callback, existing: Callback): boolean {
  return given._callback ? given === existing : given === (existing._callback || existing);
}

// on() adds no second listener of the same kind: the same function, or a wrapper of the same kind around it
export function isDuplicateCallback(
  given: Callback | null | undefined,
  existing: Callback | null | undefined
): boolean {
  return (
    given === existing ||
    (!!given?._callback && given._callback === existing?._callback && given._kind === existing._kind)
  );
}
