import type { Binder, BindingOptions, EventOptions, PropDef } from '../types.js';

interface ObjectHandlerData {
  node: Node;
  propDef: PropDef;
  binder: Binder;
  bindingOptions: BindingOptions;
  eventOptions?: EventOptions;
}

// returns a function which is called when property value is changed
export default function createObjectHandler({
  node,
  propDef,
  binder,
  bindingOptions
}: ObjectHandlerData): (eventOptions?: EventOptions) => void {
  return function objectHandler(eventOptions: EventOptions = {}) {
    const { value } = propDef;
    const { changedNode, binder: evtBinder } = eventOptions;

    // a change that came from this node through this binder isn't written back: the node already shows what the
    // user typed, even when a mediator turned it into something else ('' into 0, 'abc' into 'ABC')
    if (changedNode === node && evtBinder === binder) {
      return;
    }

    // the handler is made only for a binder with setValue
    (binder.setValue as NonNullable<Binder['setValue']>).call(node, value, { ...bindingOptions });
  };
}
