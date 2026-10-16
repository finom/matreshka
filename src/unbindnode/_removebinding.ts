import type { AnyObject, Binding } from '../types.js';
import type { BindNodeOptions } from '../bindnode/types.js';
import removeListener from '../off/_removelistener.js';
import triggerOne from '../trigger/_triggerone.js';
import forEach from '../_helpers/foreach.js';

const spaceReg = /\s+/;

// the function removes single binding for single object
// called by unbindNode
interface RemovedBinding {
  object: AnyObject;
  key: string;
  eventOptions: BindNodeOptions;
  binding: Binding;
}

export default function removeBinding({ object, key, eventOptions, binding }: RemovedBinding): void {
  const { bindingOptions, binder, node, nodeHandler, objectHandler, syncNodeHandler } = binding;
  const { debouncedNodeHandler, debouncedObjectHandler } = binding;
  const { destroy, on } = binder;
  const { silent } = eventOptions;

  // a custom "on" function can't be turned off (binder.destroy should do it), so the handler ignores further calls
  if (syncNodeHandler) {
    syncNodeHandler.disabled = true;
  }

  // drop the updates still waiting for their debounce delay
  debouncedNodeHandler?.cancel();
  debouncedObjectHandler?.cancel();

  if (typeof on === 'string') {
    // remove DOM event listener
    // removeEventListener is faster than "on" method from any DOM library
    forEach(on.split(spaceReg), (evtName) =>
      node.removeEventListener(evtName, nodeHandler as NonNullable<Binding['nodeHandler']>)
    );
  }

  // remove object event listener
  removeListener(object, `_change:bindings:${key}`, objectHandler);

  // if binder.destroy is given call it
  if (destroy) {
    destroy.call(node, bindingOptions);
  }

  // fire events
  if (!silent) {
    const extendedEventOptions = {
      key,
      node,
      ...eventOptions
    };

    triggerOne(object, `unbind:${key}`, extendedEventOptions);
    triggerOne(object, 'unbind', extendedEventOptions);
  }
}
