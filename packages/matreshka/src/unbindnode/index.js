import checkObjectType from '../_helpers/checkobjecttype';
import defs from '../_core/defs';
import getNodes from '../bindnode/_getnodes';
import removeTreeListener from '../off/_removetreelistener';
import forEach from '../_helpers/foreach';
import forOwn from '../_helpers/forown';
import assign from '../_helpers/assign';
import removeBinding from './_removebinding';
import dom from '../_dom';
import toArray from '../_helpers/toarray';
import deepBindings from '../bindnode/_deepbindings';

// removes the tree listeners of deep bindings ("a.b.c") for given key and nodes (all nodes when null)
function removeDeepBindings(object, key, $nodes) {
  const objectDeepBindings = deepBindings.get(object);

  if (!objectDeepBindings) {
    return;
  }

  const removedNodes = $nodes ? toArray($nodes) : null;
  const retain = [];

  forEach(objectDeepBindings, (deepBinding) => {
    if (deepBinding.key === key) {
      if (removedNodes) {
        deepBinding.$nodes = dom.$(toArray(deepBinding.$nodes).filter((node) => !removedNodes.includes(node)));
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

// unbinds a node
export default function unbindNode(object, key, node, eventOptions) {
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

      forEach(key, (itemKey) => unbindNode(object, itemKey, node, eventOptions));
    } else {
      /*
       * acept array of objects
       * this.unbindNode([{ key, node, binder, event }], { silent: true });
       */
      forEach(key, ({ key: itemKey, node: itemNode, event: itemEventOptions }) => {
        const commonEventOptions = node;
        const mergedEventOptions = {};

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
    forOwn(key, (keyObjValue, keyObjKey) => {
      if (keyObjValue.constructor === Object && 'node' in keyObjValue) {
        // this.unbindNode({ key: { node: $(), binder } ) }, { silent: true });
        unbindNode(object, keyObjKey, keyObjValue.node, node);
      } else if (
        keyObjValue.constructor === Array &&
        keyObjValue.length &&
        keyObjValue[0].constructor === Object &&
        'node' in keyObjValue[0]
      ) {
        // this.unbindNode({ key: [{ node: $(), binder }] ) }, { silent: true });
        forEach(keyObjValue, (keyObjValueItem) => {
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
    forOwn(props, (_, propsKey) => {
      unbindNode(object, propsKey, null, eventOptions);
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

      removeDeepBindings(object, key, $nodes);

      if (target && typeof target === 'object') {
        unbindNode(target, deepPath[deepPathLength - 1], $nodes, eventOptions);
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
  const retainBindings = [];
  const retainNodes = [];

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
      object.$nodes[key] = dom.$(retainNodes);
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
