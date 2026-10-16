import dom from './_dom';
import mq from './_dom/mq';

// forces Matrsahka to use jQuery-like DOM library for internal stuff
export default function useDOMLibrary(library) {
  if (typeof library === 'function') {
    dom.$ = library;
  } else {
    dom.$ = mq;
  }
}
