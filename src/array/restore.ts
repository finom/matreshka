import initMK from '../_core/init.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import forEach from '../_helpers/foreach.js';
import bindNode from '../bindnode/index.js';
import triggerOne from '../trigger/_triggerone.js';
import getNodes from '../bindnode/_getnodes.js';
import renderedNodes from './_processrendering/renderednodes.js';
import syncFields from './_syncfields.js';
import type { ArrayDef, ArrayMethodOptions, ItemEventOptions, MatreshkaArrayInstance, RenderedNode } from './types.js';

// restores Matreshka.Array from external nodes
export default function restore(
  this: MatreshkaArrayInstance,
  selector?: string | null,
  eventOptions: ArrayMethodOptions = {}
): MatreshkaArrayInstance {
  const selfDef = initMK(this);
  syncFields(this);
  const { Model } = this;
  const { silent } = eventOptions;
  const newItems: any[] = [];
  let nodes: ArrayLike<RenderedNode>;

  if (typeof selector === 'string') {
    // get nodes by selector
    nodes = getNodes(this, selector) as RenderedNode[];
  } else {
    // get nodes from rendering container
    const container = (this.nodes.container || this.nodes.sandbox) as Element | undefined;

    if (container) {
      nodes = container.children;
    } else {
      // no container is bound, throw an error
      throw matreshkaError('restore:no_nodes');
    }
  }

  forEach(nodes, (node, index) => {
    const item = Model ? new Model({}, this, index) : {}; // create new item
    const { bindRenderedAsSandbox } = item;
    const itemDef: ArrayDef = initMK(item);

    itemDef.renderedInArrays = {
      [selfDef.id]: node
    };
    renderedNodes.add(node);

    if (bindRenderedAsSandbox !== false) {
      bindNode(item, 'sandbox', node, null, eventOptions);
    }

    if (!silent) {
      // trigger needed events
      const itemEventOptions: ItemEventOptions = {
        node,
        self: item,
        parentArray: this
      };

      const { onRender } = item;
      const { onItemRender } = this;

      if (onRender) {
        onRender.call(item, itemEventOptions);
      }

      if (onItemRender) {
        onItemRender.call(this, item, itemEventOptions);
      }

      triggerOne(item, 'render', itemEventOptions);

      // call afterrender immediately because a node already exists in DOM tree
      triggerOne(item, 'afterrender', itemEventOptions);
    }

    newItems.push(item);
  });

  // recreate an array but don't render newly added items
  return this.recreate(newItems, {
    dontRender: true,
    ...eventOptions
  });
}
