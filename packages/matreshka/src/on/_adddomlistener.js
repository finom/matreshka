import initMK from '../_core/init';
import defineProp from '../_core/defineprop';
import addListener from './_addlistener';
import dom from '../_dom';
import createDomEventHandler from './_createdomeventhandler';
import forEach from '../_helpers/foreach';
import findDomListeners from './_finddomlisteners';

// returns an object with event handlers used at addDomListener
function createBindingHandlers({ fullEventName, domEventHandler, selector }) {
  return {
    bindHandler(evt = {}) {
      const { node } = evt;
      if (node) {
        dom.$(node).on(fullEventName, selector, domEventHandler);
      }
    },
    unbindHandler(evt = {}) {
      const { node } = evt;
      if (node) {
        dom.$(node).off(fullEventName, selector, domEventHandler);
      }
    }
  };
}

// adds DOM event listener for nodes bound to given property
// returns false when the same listener is already added
export default function addDomListener(object, key, eventName, selector, callback, context, info = {}, name) {
  const def = initMK(object);
  const propDef = defineProp(object, key);
  const bindEventName = `bind:${key}`;
  const domEventData = { eventName, selector, callback, context };

  if (findDomListeners(def.events[bindEventName], domEventData, true).length) {
    return false;
  }

  const domEventHandler = createDomEventHandler({
    key,
    object,
    callback,
    context: context || object
  });

  const eventNamespace = def.id + key;
  const fullEventName = `${eventName}.${eventNamespace}`;
  const { bindHandler, unbindHandler } = createBindingHandlers({
    fullEventName,
    domEventHandler,
    selector
  });

  // skipChecks: the listener is deduplicated above and fires addevent under its own name
  const domInfo = {
    ...info,
    skipChecks: true,
    domEvent: {
      ...domEventData,
      name: name || `${eventName}::${key}${selector ? `(${selector})` : ''}`,
      fullEventName,
      domEventHandler
    }
  };

  addListener(object, bindEventName, bindHandler, context, domInfo);
  addListener(object, `unbind:${key}`, unbindHandler, context, domInfo);

  const { bindings } = propDef;
  if (bindings) {
    forEach(bindings, ({ node }) => bindHandler({ node }));
  }

  return true;
}
