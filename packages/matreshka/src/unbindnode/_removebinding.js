import removeListener from '../off/_removelistener';
import triggerOne from '../trigger/_triggerone';
import forEach from '../_helpers/foreach';

const spaceReg = /\s+/;

// the function removes single binding for single object
// called by unbindNode
export default function removeBinding({ object, key, eventOptions, binding }) {
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
    forEach(on.split(spaceReg), (evtName) => node.removeEventListener(evtName, nodeHandler));
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
