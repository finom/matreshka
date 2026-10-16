import type { ObjectDef } from '../types.js';
import triggerOneDOMEvent from './_triggeronedomevent.js';
import forEach from '../_helpers/foreach.js';

// triggers DOM event on bound nodes
export default function triggerDOMEvent(
  def: ObjectDef,
  key: string,
  eventName: string,
  selector: string | undefined,
  triggerArgs: any[]
): void {
  const bindings = def.props[key]?.bindings;

  if (!bindings) {
    return;
  }

  forEach(bindings, ({ node }) => {
    if (selector) {
      // a text or attribute node (bound by parseBindings) has no descendants
      if (!('querySelectorAll' in node)) return;
      // if selector is given trigger an event on all node descendants
      const descendants = (node as Element).querySelectorAll(selector);
      forEach(descendants, (descendant) => {
        triggerOneDOMEvent({
          node: descendant,
          eventName,
          triggerArgs
        });
      });
    } else {
      // trigger an event for single node
      triggerOneDOMEvent({
        node,
        eventName,
        triggerArgs
      });
    }
  });
}
