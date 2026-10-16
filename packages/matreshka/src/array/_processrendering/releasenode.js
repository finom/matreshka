import defs from '../../_core/defs';
import unbindNode from '../../unbindnode';
import forOwn from '../../_helpers/forown';
import forEach from '../../_helpers/foreach';
import toArray from '../../_helpers/toarray';
import deepBindings from '../../bindnode/_deepbindings';

// window and other non-Node targets can't be inside a rendered node
const isInside = (boundNode, node) =>
  !!boundNode && typeof boundNode.nodeType === 'number' && (boundNode === node || node.contains(boundNode));

// removes every binding of an item to a rendered node or to a node inside it
export default function releaseNode(item, node, eventOptions) {
  const itemDef = defs.get(item);

  if (!itemDef) {
    return;
  }

  // deep bindings ("a.b") live at the end of their path; unbindNode finds them by the dotted key
  const toRelease = [];

  forEach(deepBindings.get(item) || [], ({ key, $nodes }) => {
    forEach(toArray($nodes), (boundNode) => {
      if (isInside(boundNode, node)) {
        toRelease.push({ key, boundNode, options: eventOptions });
      }
    });
  });

  // own properties, including exact keys with a dot in their name
  const exactKeyOptions = { ...eventOptions, exactKey: true };

  forOwn(itemDef.props, (propDef, key) => {
    forEach(propDef?.bindings || [], ({ node: boundNode }) => {
      if (isInside(boundNode, node)) {
        toRelease.push({ key, boundNode, options: exactKeyOptions });
      }
    });
  });

  forEach(toRelease, ({ key, boundNode, options }) => unbindNode(item, key, boundNode, options));
}
