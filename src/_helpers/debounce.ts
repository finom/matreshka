import apply from './apply.js';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
// (c) https://davidwalsh.name/javascript-debounce-function

export interface Debounced<F extends (...args: any[]) => any> {
  (this: any, ...args: Parameters<F>): void;
  cancel(): void;
}

export default function debounce<F extends (...args: any[]) => any>(
  func: F,
  givenDelay?: number | object,
  thisArg?: any
): Debounced<F> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let delay: number;
  if (typeof givenDelay !== 'number') {
    thisArg = givenDelay;
    delay = 0;
  } else {
    delay = givenDelay || 0;
  }

  function debounced(this: any, ...args: any[]) {
    const callContext = thisArg || this;

    clearTimeout(timeout);

    timeout = setTimeout(() => apply(func, callContext, args), delay);
  }

  // drops a pending call
  debounced.cancel = () => clearTimeout(timeout);

  return debounced as Debounced<F>;
}
