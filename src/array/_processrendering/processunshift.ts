import renderItemNode from './renderitemnode.js';
import triggerOne from '../../trigger/_triggerone.js';
import checkAlreadyRendered from './checkalreadyrendered.js';
import type { RenderingArgs } from '../types.js';

// this function renders inserted items if possible when unshift or push method is called
export default function processUnshift({ self, selfDef, eventOptions, container }: RenderingArgs): void {
  const { added, silent } = eventOptions;

  // iterate over all added items in opposite order
  for (let i = added.length - 1; i + 1; i--) {
    const item = added[i];
    if (item && typeof item === 'object') {
      // if a node of an item is already rendered then throw an error
      checkAlreadyRendered({
        item,
        selfDef
      });

      const { node, itemEventOptions } = renderItemNode({
        selfDef,
        self,
        item,
        eventOptions
      });

      if (node) {
        if (container.firstChild) {
          container.insertBefore(node, container.firstChild);
        } else {
          container.appendChild(node);
        }

        if (!silent) {
          triggerOne(item, 'afterrender', itemEventOptions);
        }
      }
    }
  }
}
