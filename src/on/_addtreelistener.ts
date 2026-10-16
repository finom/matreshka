import type { AnyObject, EventHandler } from '../types.js';
import delegateListener from './_delegatelistener/index.js';
import removeTreeListener from '../off/_removetreelistener.js';

// creates tree listener
function createTreeListener({ handler, restPath }: { handler: EventHandler; restPath: string[] }) {
  const newHandler = function treeListener(this: any, changeEvent: AnyObject) {
    const extendedChangeEvent = {
      restPath,
      ...changeEvent
    };
    const { previousValue, value } = changeEvent;

    // removes listener for all branches of the path on old object
    if (previousValue && typeof previousValue === 'object') {
      removeTreeListener(previousValue, restPath, handler);
    }

    // adds listener for all branches of "restPath" path on newly assigned object
    if (value && typeof value === 'object') {
      addTreeListener(value, restPath, handler);
    }

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
