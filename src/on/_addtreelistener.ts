import type { AnyObject, EventHandler } from '../types.js';
import delegateListener from './_delegatelistener/index.js';

// creates tree listener
function createTreeListener({ handler, restPath }: { handler: EventHandler; restPath: string[] }) {
  const newHandler = function treeListener(this: any, changeEvent: AnyObject) {
    const extendedChangeEvent = {
      restPath,
      ...changeEvent
    };
    // call original handler
    handler.call(this, extendedChangeEvent);
  };

  newHandler._callback = handler;

  return newHandler;
}

// listens changes for all branches of given path
// TODO: Pass context to addTreeListener
// one of the most hard functions to understand
export default function addTreeListener(object: AnyObject, deepPath: string | string[], handler: EventHandler): void {
  if (typeof deepPath === 'string') {
    deepPath = deepPath.split('.');
  }

  // iterate over all keys and delegate listener for all objects of given branch
  for (let i = 0; i < deepPath.length; i++) {
    // TODO: Array.prototype.slice method is slow
    const listenPath = deepPath.slice(0, i);
    const restPath = deepPath.slice(i + 1);

    delegateListener(
      object,
      listenPath,
      `_change:tree:${deepPath[i]}`,
      createTreeListener({
        handler,
        restPath
      })
    );
  }
}
