import type { Binder, BindingOptions, EventOptions, PropDef } from '../types.js';
import is from '../_helpers/is.js';

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
    const { changedNode, binder: evtBinder, onChangeValue } = eventOptions;
    const fromThisNode = changedNode === node && evtBinder === binder;

    // a change that came from this node through this binder isn't written back while the node shows that value,
    // also as typed text of the same number ('' for 0, '1.50' for 1.5); a mediator that changed it (a clamp, 'ABC')
    // is written back
    if (fromThisNode && (is(value, onChangeValue) || (typeof value === 'number' && is(Number(onChangeValue), value)))) {
      return;
    }

    // the field being typed in keeps its caret through the mediator's rewrite; null for a field with no selection
    // (number, email and the like)
    const field = node as HTMLInputElement;
    const { selectionStart, selectionEnd } =
      fromThisNode && field.ownerDocument?.activeElement === field ? field : noSelection;

    // the handler is made only for a binder with setValue
    (binder.setValue as NonNullable<Binder['setValue']>).call(node, value, { ...bindingOptions });

    if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
      const { length } = field.value;
      field.setSelectionRange(Math.min(selectionStart, length), Math.min(selectionEnd, length));
    }
  };
}

const noSelection = { selectionStart: null, selectionEnd: null };
