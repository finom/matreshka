import type { AnyObject, Binder, BindingOptions, PropDef } from '../types.js';
import is from '../_helpers/is.js';
import set from '../set.js';
import assign from '../_helpers/assign.js';

interface NodeHandlerData {
  object: AnyObject;
  key: string;
  node: Node;
  propDef: PropDef;
  binder: Binder;
  bindingOptions: BindingOptions;
}

// the node handler; unbindNode sets "disabled"
export type NodeHandler = ((domEvent?: any) => void) & { disabled?: boolean };

// returns a function which called when bound node state is changed (eg DOM event is fired)
export default function createNodeHandler({
  object,
  key,
  node,
  propDef,
  binder,
  bindingOptions
}: NodeHandlerData): NodeHandler {
  const nodeHandler: NodeHandler = (domEvent: any = {}) => {
    // nodeHandler.disabled = true is set in unbindNode
    // we cannot "turn off" binder.on when its value is a function
    // developer needs to clean memory ("turn off" callback) manualy in binder.destroy
    if (nodeHandler.disabled) {
      return;
    }

    const previousValue = propDef.value;
    const { which, target, ctrlKey, altKey } = domEvent;
    const { getValue } = binder;
    // the handler is made only for a binder with getValue
    const value = (getValue as NonNullable<Binder['getValue']>).call(
      node,
      assign(
        {
          previousValue,
          domEvent,
          originalEvent: domEvent.originalEvent || domEvent, // jQuery thing
          // will throw "preventDefault is not a function" when domEvent is empty object
          preventDefault: () => domEvent.preventDefault(),
          // will throw "stopPropagation is not a function" when domEvent is empty object
          stopPropagation: () => domEvent.stopPropagation(),
          which,
          target,
          ctrlKey,
          altKey
        },
        bindingOptions
      )
    );

    if (!is(value, previousValue)) {
      set(object, key, value, {
        fromNode: true,
        // the following properties are needed to avoid circular changes
        // they are used at objectHandler
        changedNode: node,
        onChangeValue: value,
        binder
      });
    }
  };

  return nodeHandler;
}
