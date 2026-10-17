import renderItemNode from './renderitemnode.js';
import triggerOne from '../../trigger/_triggerone.js';
import forEach from '../../_helpers/foreach.js';
import checkAlreadyRendered from './checkalreadyrendered.js';
import getAlreadyRendered from './getalreadyrendered.js';
import type { RenderingArgs } from '../types.js';
import privateKey from '../../_helpers/privatekey.js';

// the index where splice inserted the items; a symbol, so it never clashes with user's event options
export const spliceStart: string = privateKey('spliceStart');

// the function handles rendering of added items passed as third and rest arguments to splice method
export default function processSpliceAdd({ self, selfDef, eventOptions, container }: RenderingArgs): void {
  const { added, silent } = eventOptions;
  let nextNode: ChildNode | undefined;

  // find the first rendered node after the last added item to insert newly rendered items before it
  for (let i = (eventOptions[spliceStart] as number) + added.length; i < self.length && !nextNode; i++) {
    const next = self[i];

    if (next && typeof next === 'object') {
      nextNode = getAlreadyRendered({
        item: next,
        selfDef
      });
    }
  }

  forEach(added, (item) => {
    if (item && typeof item === 'object') {
      // an item the same splice removes keeps its node, which only moves
      const kept =
        !!eventOptions.removed && eventOptions.removed.indexOf(item) !== -1 && getAlreadyRendered({ item, selfDef });
      if (kept) {
        if (nextNode) {
          container.insertBefore(kept, nextNode);
        } else {
          container.appendChild(kept);
        }
        return;
      }

      // throw an error if node of an item is alread rendered
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
        if (nextNode) {
          container.insertBefore(node, nextNode);
        } else {
          container.appendChild(node);
        }

        if (!silent) {
          triggerOne(item, 'afterrender', itemEventOptions);
        }
      }
    }
  });
}
