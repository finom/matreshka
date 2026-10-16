import defs from '../../_core/defs.js';
import forEach from '../../_helpers/foreach.js';
import type { ArrayDef, RenderingArgs } from '../types.js';

// this function removes DOM nodes of removed items
// called on splice, pull, pop and shift
export default function processRemove({ selfDef, eventOptions }: RenderingArgs): void {
  const { removed, added } = eventOptions;
  const { id: selfId } = selfDef;
  forEach(removed, (item) => {
    // a splice that puts an item back keeps its node
    if (item && typeof item === 'object' && !added?.includes(item)) {
      const itemDef: ArrayDef | undefined = defs.get(item);
      if (itemDef) {
        const { renderedInArrays } = itemDef;
        const node = renderedInArrays?.[selfId];
        if (renderedInArrays && node) {
          delete renderedInArrays[selfId];
          // the node may be out of the current container (e.g. the container was rebound)
          // or replaced by a placeholder (the existence binder)
          node.__replacedByNode?.remove();
          node.remove();
        }
      }
    }
  });
}
