import initMK from '../_core/init';
import matreshkaError from '../_helpers/matreshkaerror';
import forEach from '../_helpers/foreach';
import bindNode from '../bindnode';
import triggerOne from '../trigger/_triggerone';
import getNodes from '../bindnode/_getnodes';
import renderedNodes from './_processrendering/renderednodes';
import syncFields from './_syncfields';

// restores Matreshka.Array from external nodes
export default function restore(selector, eventOptions = {}) {
  const selfDef = initMK(this);
  syncFields(this);
  const { Model } = this;
  const { silent } = eventOptions;
  const newItems = [];
  let nodes;

  if (typeof selector === 'string') {
    // get nodes by selector
    nodes = getNodes(this, selector);
  } else {
    // get nodes from rendering container
    const container = this.nodes.container || this.nodes.sandbox;

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
    const itemDef = initMK(item);

    itemDef.renderedInArrays = {
      [selfDef.id]: node
    };
    renderedNodes.add(node);

    if (bindRenderedAsSandbox !== false) {
      bindNode(item, 'sandbox', node, null, eventOptions);
    }

    if (!silent) {
      // trigger needed events
      const itemEventOptions = {
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
