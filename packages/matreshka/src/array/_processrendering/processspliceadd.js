import renderItemNode from './renderitemnode';
import triggerOne from '../../trigger/_triggerone';
import forEach from '../../_helpers/foreach';
import checkAlreadyRendered from './checkalreadyrendered';
import getAlreadyRendered from './getalreadyrendered';

// the index where splice inserted the items; a symbol, so it never clashes with user's event options
export const spliceStart = Symbol('spliceStart');

// the function handles rendering of added items passed as third and rest arguments to splice method
export default function processSpliceAdd({ self, selfDef, eventOptions, container }) {
  const { added, silent } = eventOptions;
  let nextNode;

  // find the first rendered node after the last added item to insert newly rendered items before it
  for (let i = eventOptions[spliceStart] + added.length; i < self.length && !nextNode; i++) {
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
