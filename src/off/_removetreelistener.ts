import type { AnyObject, EventHandler } from '../types.js';
import undelegateListener from './_undelegatelistener.js';

// removes tree listener from all object tree of fiven path
// TODO: Pass context to removeTreeListener
export default function removeTreeListener(
  object: AnyObject,
  deepPath: string | string[],
  handler?: EventHandler
): void {
  if (typeof deepPath === 'string') {
    deepPath = deepPath.split('.');
  }

  // iterate over keys of the path and undelegate given handler (can be undefined)
  for (let i = 0; i < deepPath.length; i++) {
    // TODO: Array.prototype.slice is slow
    const listenedPath = deepPath.slice(0, i);

    undelegateListener(object, listenedPath, `_change:tree:${deepPath[i]}`, handler);
  }
}
