import type { AnyObject, Binder } from '../types.js';
import type { BindNodeOptions, DeepBinding, NodeInput } from './types.js';
import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import getNodes from './_getnodes.js';
import createBindingSwitcher from './_createbindingswitcher.js';
import bindSingleNode from './_bindsinglenode.js';
import forEach from '../_helpers/foreach.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import addTreeListener from '../on/_addtreelistener.js';
import { uniqueNodes } from '../_dom/index.js';
import deepBindings from './_deepbindings.js';

// binds one key (a path when it has dots) to its nodes: bindNode's other forms come down to this, and the parsers
// call it with keys they read from the DOM
export default function bindKey(
  object: AnyObject,
  key: string,
  node: NodeInput,
  binder?: Binder | null,
  eventOptions: BindNodeOptions = {},
  optionalFlag = false
): AnyObject {
  if (!key) {
    throw matreshkaError('binding:falsy_key');
  }

  initMK(object);
  binder = binder || {};

  const {
    optional = optionalFlag, // check out bindOptionalNode
    exactKey = false
  } = eventOptions;
  const $nodes = getNodes(object, node);

  // check node existence
  if (!$nodes.length) {
    if (optional) {
      return object;
    }

    throw matreshkaError('binding:node_missing', { key, node });
  }

  if (!exactKey) {
    const deepPath = key.split('.');
    const deepPathLength = deepPath.length;

    if (deepPathLength > 1) {
      // handle binding when key arg includes dots (eg "a.b.c.d")
      const deepBinding: DeepBinding = { key, deepPath, $nodes };
      const bindingSwitcher = createBindingSwitcher({
        object,
        deepBinding,
        binder,
        eventOptions,
        bindKey
      });

      deepBinding.bindingSwitcher = bindingSwitcher;

      if (!deepBindings.has(object)) {
        deepBindings.set(object, []);
      }

      (deepBindings.get(object) as DeepBinding[]).push(deepBinding);

      addTreeListener(object, deepPath.slice(0, deepPathLength - 1), bindingSwitcher);

      bindingSwitcher();

      return object;
    }
  }

  const propDef = defineProp(object, key);

  // "sandbox" (and an array's "container") takes one node; checked before $nodes changes
  if (
    (key === 'sandbox' || (object.isMatreshkaArray && key === 'container')) &&
    (propDef.bindings?.length ?? 0) + $nodes.length > 1
  ) {
    throw matreshkaError('binding:magic_props_nodes_length');
  }

  if (object.isMatreshka) {
    // if an object is Matreshka instance then extend "$nodes" and "nodes" objects
    const { $nodes: $allNodes, nodes: allNodes } = object;

    if (!$allNodes || !allNodes) {
      throw matreshkaError('binding:instance_nodes_missing', {
        $nodes: $allNodes,
        nodes: allNodes
      });
    }

    $allNodes[key] = $allNodes[key]?.length ? uniqueNodes($allNodes[key], $nodes) : $nodes;

    allNodes[key] = $allNodes[key][0];
  }

  // handle binding for every node separately
  forEach($nodes, (oneNode) =>
    bindSingleNode(object, {
      $nodes,
      node: oneNode,
      key,
      eventOptions,
      binder,
      propDef
    })
  );

  return object;
}
