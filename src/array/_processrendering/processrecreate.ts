import renderItemNode from './renderitemnode.js';
import triggerOne from '../../trigger/_triggerone.js';
import defs from '../../_core/defs.js';
import matreshkaError from '../../_helpers/matreshkaerror.js';
import forEach from '../../_helpers/foreach.js';
import getAlreadyRendered from './getalreadyrendered.js';
import type { ArrayDef, RenderingArgs } from '../types.js';
import removeNode from '../../_helpers/removenode.js';

// this function renders inserted items if possible when recreate method is called
export default function processRecreate({ self, selfDef, eventOptions, container }: RenderingArgs): void {
  const { removed, silent } = eventOptions;
  const { id: selfId } = selfDef;

  // iterate over removed items and remove their nodes
  forEach(removed, (item) => {
    const itemDef: ArrayDef | undefined = defs.get(item);

    if (itemDef) {
      const { renderedInArrays } = itemDef;
      const node = renderedInArrays?.[selfId];
      if (renderedInArrays && node) {
        delete renderedInArrays[selfId];
        removeNode(node.__replacedByNode);
        removeNode(node);
      }
    }
  });

  const alreadyRenderedMap: Record<number, true> = {};

  // iterate over all items
  // the following approach allows to throw an error when two added objects are the same
  // (not only compare existing items with old ones)
  forEach(self, (item) => {
    if (item && typeof item === 'object') {
      let itemDef: ArrayDef | undefined = defs.get(item);
      let alreadyRenderedNode: ChildNode | undefined;

      if (itemDef) {
        alreadyRenderedNode = getAlreadyRendered({
          item,
          selfDef
        });
      }

      if (itemDef && alreadyRenderedNode) {
        // if an item is already rendered (old item)
        if (itemDef.id in alreadyRenderedMap) {
          // if an item is rendered twice throw an error
          throw matreshkaError('array:add_render_twice');
        }

        alreadyRenderedMap[itemDef.id] = true;

        container.appendChild(alreadyRenderedNode);
      } else {
        // this is newly added item
        const { node, itemEventOptions } = renderItemNode({
          selfDef,
          self,
          item,
          eventOptions
        });

        if (node) {
          // renderItemNode gave the item a definition; a second place of the item finds its node above and throws
          itemDef = itemDef || (defs.get(item) as ArrayDef);
          alreadyRenderedMap[itemDef.id] = true;

          container.appendChild(node);

          if (!silent) {
            triggerOne(item, 'afterrender', itemEventOptions);
          }
        }
      }
    }
  });
}
