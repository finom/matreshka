import apply from './apply';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds.
// (c) https://davidwalsh.name/javascript-debounce-function

export default function debounce(func, givenDelay, thisArg) {
  let timeout;
  let delay;
  if (typeof givenDelay !== 'number') {
    thisArg = givenDelay;
    delay = 0;
  } else {
    delay = givenDelay || 0;
  }

  function debounced() {
    const args = arguments;
    const callContext = thisArg || this;

    clearTimeout(timeout);

    timeout = setTimeout(() => apply(func, callContext, args), delay);
  }

  // drops a pending call
  debounced.cancel = () => clearTimeout(timeout);

  return debounced;
}
