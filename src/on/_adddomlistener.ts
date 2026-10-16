import type { AnyObject, EventHandler, PropDef } from '../types.js';
import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import addListener from './_addlistener.js';
import { listen, unlisten } from '../_dom/index.js';
import createDomEventHandler from './_createdomeventhandler.js';
import forEach from '../_helpers/foreach.js';
import findDomListeners from './_finddomlisteners.js';

type BindEvent = { node?: Node };

// returns an object with event handlers used at addDomListener
function createBindingHandlers({
  eventName,
  domEventHandler,
  selector
}: {
  eventName: string;
  domEventHandler: (this: Node, domEvent: any) => void;
  selector: string | undefined;
}) {
  return {
    bindHandler(evt: BindEvent = {}) {
      const { node } = evt;
      if (node) {
        listen(node, eventName, selector, domEventHandler);
      }
    },
    unbindHandler(evt: BindEvent = {}) {
      const { node } = evt;
      if (node) {
        unlisten(node, eventName, selector, domEventHandler);
      }
    }
  };
}

// adds DOM event listener for nodes bound to given property
// returns false when the same listener is already added
export default function addDomListener(
  object: AnyObject,
  key: string,
  eventName: string,
  selector: string | undefined,
  callback: EventHandler,
  context?: any,
  info: Record<string, any> = {},
  name?: string
): boolean {
  const def = initMK(object);
  // the object has a definition now, so defineProp returns one
  const propDef = defineProp(object, key) as PropDef;
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

  const { bindHandler, unbindHandler } = createBindingHandlers({
    eventName,
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
