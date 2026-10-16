import unbindNode from '../../unbindnode/index.js';
import forOwn from '../../_helpers/forown.js';
import forEach from '../../_helpers/foreach.js';
import toArray from '../../_helpers/toarray.js';
import deepBindings from '../../bindnode/_deepbindings.js';
import type { AnyObject, EventOptions, ObjectDef } from '../../types.js';

// window and other non-Node targets can't be inside a rendered node; an attribute is where its element is
const isInside = (boundNode: any, node: Node): boolean => {
  const target = boundNode?.ownerElement ?? boundNode;
  return !!target && typeof target.nodeType === 'number' && (target === node || node.contains(target));
};

// removes every binding of an item to a rendered node or to a node inside it
export default function releaseNode(
  item: AnyObject,
  itemDef: ObjectDef,
  node: Node,
  eventOptions?: EventOptions
): void {
  // deep bindings ("a.b") live at the end of their path; unbindNode finds them by the dotted key
  const toRelease: { key: string; boundNode: Node; options: EventOptions | undefined }[] = [];

  forEach(deepBindings.get(item) || [], ({ key, $nodes }: { key: string; $nodes: ArrayLike<Node> }) => {
    forEach(toArray($nodes), (boundNode) => {
      if (isInside(boundNode, node)) {
        toRelease.push({ key, boundNode, options: eventOptions });
      }
    });
  });

  // own properties, including exact keys with a dot in their name
  const exactKeyOptions: EventOptions = { ...eventOptions, exactKey: true };

  forOwn(itemDef.props, (propDef, key) => {
    forEach(propDef?.bindings || [], ({ node: boundNode }) => {
      if (isInside(boundNode, node)) {
        toRelease.push({ key, boundNode, options: exactKeyOptions });
      }
    });
  });

  forEach(toRelease, ({ key, boundNode, options }) => unbindNode(item, key, boundNode, options));
}
