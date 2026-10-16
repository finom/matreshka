import type { AnyObject, Binding } from '../types.js';
import type {
  BindingItem,
  BindNodeOptions,
  DeepBinding,
  KeyNodeMap,
  NodeInput,
  NodeWithBinder
} from '../bindnode/types.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import defs from '../_core/defs.js';
import getNodes from '../bindnode/_getnodes.js';
import removeTreeListener from '../off/_removetreelistener.js';
import forEach from '../_helpers/foreach.js';
import forOwn from '../_helpers/forown.js';
import assign from '../_helpers/assign.js';
import removeBinding from './_removebinding.js';
import toArray from '../_helpers/toarray.js';
import deepBindings from '../bindnode/_deepbindings.js';

// removes the tree listeners of deep bindings ("a.b.c") for given key and nodes (all nodes when null)
function removeDeepBindings(object: AnyObject, key: string, $nodes: Node[] | null): void {
  const objectDeepBindings = deepBindings.get(object);

  if (!objectDeepBindings) {
    return;
  }

  const removedNodes = $nodes ? toArray($nodes) : null;
  const retain: DeepBinding[] = [];

  forEach(objectDeepBindings, (deepBinding) => {
    if (deepBinding.key === key) {
      if (removedNodes) {
        deepBinding.$nodes = toArray(deepBinding.$nodes).filter((node) => !removedNodes.includes(node));
      }

      if (!removedNodes || !deepBinding.$nodes.length) {
        removeTreeListener(object, deepBinding.deepPath.slice(0, -1), deepBinding.bindingSwitcher);
        return;
      }
    }

    retain.push(deepBinding);
  });

  if (retain.length) {
    deepBindings.set(object, retain);
  } else {
    deepBindings.delete(object);
  }
}

// unbinds a node; no key removes every binding of the object, no node every binding of the key
export default function unbindNode<T extends object>(
  object: T,
  key?: string | string[] | null,
  node?: NodeInput,
  eventOptions?: BindNodeOptions
): T;
// { key: node } or { key: { node } }
export default function unbindNode<T extends object>(
  object: T,
  bindings: KeyNodeMap,
  eventOptions?: BindNodeOptions
): T;
// [{ key, node, event }]; eventOptions are common to all items
export default function unbindNode<T extends object>(
  object: T,
  bindings: BindingItem[],
  eventOptions?: BindNodeOptions
): T;
export default function unbindNode(this: any, object: any, key?: any, node?: any, eventOptions?: any): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = node;
    node = key;
    key = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'unbindNode');
  }

  if (Array.isArray(key)) {
    if (typeof key[0] === 'string') {
      /*
       * accept array of keys
       * this.unbindNode(['a', 'b', 'c'], node)
       */

      forEach(key as string[], (itemKey) => unbindNode(object, itemKey, node, eventOptions));
    } else {
      /*
       * acept array of objects
       * this.unbindNode([{ key, node, binder, event }], { silent: true });
       */
      forEach(key as BindingItem[], ({ key: itemKey, node: itemNode, event: itemEventOptions }) => {
        const commonEventOptions: BindNodeOptions | undefined = node;
        const mergedEventOptions: BindNodeOptions = {};

        if (commonEventOptions) {
          // extend event object by "global" event
          assign(mergedEventOptions, commonEventOptions);
        }

        if (itemEventOptions) {
          // extend event object by "local" event ("event" key of an object)
          assign(mergedEventOptions, itemEventOptions);
        }

        unbindNode(object, itemKey, itemNode, mergedEventOptions);
      });
    }

    return object;
  }

  if (key && typeof key === 'object') {
    forOwn(key as KeyNodeMap, (keyObjValue: any, keyObjKey) => {
      if (!keyObjValue) {
        unbindNode(object, keyObjKey, null, node);
      } else if (keyObjValue.constructor === Object && 'node' in keyObjValue) {
        // this.unbindNode({ key: { node: $(), binder } ) }, { silent: true });
        unbindNode(object, keyObjKey, keyObjValue.node, node);
      } else if (
        keyObjValue.constructor === Array &&
        keyObjValue.length &&
        keyObjValue[0].constructor === Object &&
        'node' in keyObjValue[0]
      ) {
        // this.unbindNode({ key: [{ node: $(), binder }] ) }, { silent: true });
        forEach(keyObjValue as NodeWithBinder[], (keyObjValueItem) => {
          unbindNode(object, keyObjKey, keyObjValueItem.node, node);
        });
      } else {
        // this.unbindNode({ key: $() }, { silent: true });
        unbindNode(object, keyObjKey, keyObjValue, node);
      }
    });
    return object;
  }

  eventOptions = eventOptions || {};
  const { deep, exactKey } = eventOptions;
  const def = defs.get(object);

  if (!def) {
    return object;
  }

  const { props } = def;

  // allow to pass null or undefined as key
  // if passed then remove bindings of all keys for given object
  if (key === null || typeof key === 'undefined') {
    // a prop's key is exact: "a.b" made with exactKey is a key with a dot, not a path
    forOwn(props, (_, propsKey) => {
      unbindNode(object, propsKey, null, { ...eventOptions, exactKey: true });
    });

    const objectDeepBindings = deepBindings.get(object);

    if (objectDeepBindings) {
      forEach(objectDeepBindings, (deepBinding) => {
        unbindNode(object, deepBinding.key, null, eventOptions);
      });
    }

    return object;
  }

  // remove delegated binding
  if (deep !== false && !exactKey) {
    const deepPath = key.split('.');
    const deepPathLength = deepPath.length;

    if (deepPathLength > 1) {
      const $nodes = node ? getNodes(object, node) : null;
      let target = object;

      for (let i = 0; i < deepPathLength - 1; i++) {
        target = target[deepPath[i]];

        // the branch is gone, so there is no binding to remove from its end
        if (!target || typeof target !== 'object') {
          break;
        }
      }

      // without a node, only the nodes of this deep binding: a binding made on the target directly stays
      const ownNodes =
        $nodes ??
        (deepBindings.get(object) ?? [])
          .filter((deepBinding) => deepBinding.key === key)
          .flatMap((deepBinding) => toArray(deepBinding.$nodes));

      removeDeepBindings(object, key, $nodes);

      if (target && typeof target === 'object' && ownNodes.length) {
        unbindNode(target, deepPath[deepPathLength - 1], ownNodes, eventOptions);
      }

      return object;
    }
  }

  const propDef = props[key];

  // when no propdef do nothing
  if (!propDef) {
    return object;
  }

  const { bindings } = propDef;

  // if the property doesn't have any bindings do nothing
  if (!bindings) {
    return object;
  }

  // if no node is pased remove all bindings for given key
  if (!node) {
    forEach(bindings, (binding) => {
      removeBinding({
        object,
        key,
        eventOptions,
        binding
      });
    });

    propDef.bindings = null;

    // update nodes and $nodes for Matreshka instance
    if (object.isMatreshka) {
      delete object.nodes[key];
      delete object.$nodes[key];
    }

    return object;
  }

  const removedNodes = toArray(getNodes(object, node));
  const retainBindings: Binding[] = [];
  const retainNodes: Node[] = [];

  forEach(bindings, (binding) => {
    if (removedNodes.includes(binding.node)) {
      removeBinding({
        object,
        key,
        eventOptions,
        binding
      });
    } else {
      retainBindings.push(binding);

      if (!retainNodes.includes(binding.node)) {
        retainNodes.push(binding.node);
      }
    }
  });

  // update nodes and $nodes for Matreshka instance
  if (object.isMatreshka) {
    if (retainNodes.length) {
      object.nodes[key] = retainNodes[0];
      object.$nodes[key] = retainNodes;
    } else {
      delete object.nodes[key];
      delete object.$nodes[key];
    }
  }

  // update bindings object
  if (retainBindings.length) {
    propDef.bindings = retainBindings;
  } else {
    propDef.bindings = null;
  }

  return object;
}
