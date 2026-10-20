import matreshkaError from '../../_helpers/matreshkaerror.js';
import forEach from '../../_helpers/foreach.js';
import checkAlreadyRendered from './checkalreadyrendered.js';
import type { ArrayDef, ArrayMethodOptions, MatreshkaArrayInstance } from '../types.js';

// whether a change made with these options renders: rendering is on and the array has a container
export function rendersChange(self: MatreshkaArrayInstance, eventOptions?: ArrayMethodOptions | null): boolean {
  const { renderIfPossible = true } = self;
  return !!(renderIfPossible && !eventOptions?.dontRender && (self.nodes.container || self.nodes.sandbox));
}

// fill and copyWithin can't render: they throw before they change the array
export function checkCompatRenderer(
  self: MatreshkaArrayInstance,
  method: string,
  eventOptions?: ArrayMethodOptions | null
): void {
  if (rendersChange(self, eventOptions)) {
    throw matreshkaError('array:method_compat_renderer', { method });
  }
}

// an adding method throws before it changes the array where rendering the added items would throw: an item
// rendered already, or one object twice; an item the same splice removes (`kept`) keeps its node, which moves
export default function checkAddedItems(
  self: MatreshkaArrayInstance,
  selfDef: ArrayDef,
  added: any[],
  eventOptions?: ArrayMethodOptions | null,
  kept?: any[]
): void {
  if (!rendersChange(self, eventOptions)) {
    return;
  }

  const rendering = new WeakMap<object, true>();
  const { itemRenderer } = self as MatreshkaArrayInstance & { itemRenderer?: unknown };

  forEach(added, (item) => {
    if (item && typeof item === 'object' && !(kept && kept.indexOf(item) !== -1)) {
      checkAlreadyRendered({ item, selfDef });

      // only an item with a renderer gets a node, so only its second place throws
      if (item.renderer || itemRenderer) {
        if (rendering.has(item)) {
          throw matreshkaError('array:add_render_twice');
        }

        rendering.set(item, true);
      }
    }
  });
}
