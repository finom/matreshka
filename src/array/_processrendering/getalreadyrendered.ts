import defs from '../../_core/defs.js';
import type { ArrayDef } from '../types.js';

// returns already rendered node of an object in given array
// selfDef is given instead of  itself (array) for perf optimisation
export default function getAlreadyRendered({
  item,
  selfDef
}: {
  item: object;
  selfDef: ArrayDef;
}): ChildNode | undefined {
  const itemDef: ArrayDef | undefined = defs.get(item);
  const { id: selfId } = selfDef;

  // if item object is defined in object defs
  if (itemDef) {
    const { renderedInArrays } = itemDef;

    // if item's node is already rendered for an array then return it
    if (renderedInArrays?.[selfId]) {
      const node = renderedInArrays[selfId];
      return node.__replacedByNode || node;
    }
  }

  return undefined;
}
