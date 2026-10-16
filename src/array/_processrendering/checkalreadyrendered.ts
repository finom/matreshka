import defs from '../../_core/defs.js';
import matreshkaError from '../../_helpers/matreshkaerror.js';
import type { ArrayDef } from '../types.js';

// checks is item already rendered in an array
// selfDef is given instead of itself (array) for perf optimisation
export default function checkAlreadyRendered({ item, selfDef }: { item: object; selfDef: ArrayDef }): void {
  const itemDef: ArrayDef | undefined = defs.get(item);
  const { id: selfId } = selfDef;

  // if item object is defined in object defs
  if (itemDef) {
    const { renderedInArrays } = itemDef;

    // if item's node is already rendered for an array
    // then throw an error
    if (renderedInArrays?.[selfId]) {
      throw matreshkaError('array:add_render_twice');
    }
  }
}
