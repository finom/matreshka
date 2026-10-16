import getAlreadyRendered from './getalreadyrendered.js';
import forEach from '../../_helpers/foreach.js';
import type { RenderingArgs } from '../types.js';

// this function gets called when array is sorted (via sort, orderBy or reverse)
export default function processSort({
  self,
  selfDef,
  // eventOptions,
  container
}: RenderingArgs): void {
  // just re-insert rendered nodes in new order
  forEach(self, (item) => {
    if (item && typeof item === 'object') {
      const node = getAlreadyRendered({
        item,
        selfDef
      });

      if (node) {
        container.appendChild(node);
      }
    }
  });
}
