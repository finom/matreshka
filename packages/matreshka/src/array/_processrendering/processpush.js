import renderItemNode from './renderitemnode';
import triggerOne from '../../trigger/_triggerone';
import checkAlreadyRendered from './checkalreadyrendered';
import forEach from '../../_helpers/foreach';

// this function renders inserted items if possible when push method is called
export default function processPush({ self, selfDef, eventOptions, container }) {
  const { added, silent } = eventOptions;

  forEach(added, (item) => {
    if (item && typeof item === 'object') {
      // if a node of an item is already rendered then throw an error
      checkAlreadyRendered({
        item,
        selfDef
      });

      // render
      const { node, itemEventOptions } = renderItemNode({
        selfDef,
        self,
        item,
        eventOptions
      });

      if (node) {
        container.appendChild(node);
        if (!silent) {
          triggerOne(item, 'afterrender', itemEventOptions);
        }
      }
    }
  });
}
