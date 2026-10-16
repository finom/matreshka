import type { PropDef, Binder } from '../types.js';
import type {
  BindingItem,
  BindNodeOptions,
  DeepBinding,
  KeyNodeMap,
  NodeInput,
  NodeWithBinder,
  OptionalFlagHolder
} from './types.js';
import initMK from '../_core/init.js';
import defineProp from '../_core/defineprop.js';
import getNodes from './_getnodes.js';
import createBindingSwitcher from './_createbindingswitcher.js';
import bindSingleNode from './_bindsinglenode.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import forOwn from '../_helpers/forown.js';
import forEach from '../_helpers/foreach.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import addTreeListener from '../on/_addtreelistener.js';
import assign from '../_helpers/assign.js';
import { uniqueNodes } from '../_dom/index.js';
import deepBindings from './_deepbindings.js';

// initializes binsing between a property of an object to HTML node
// key may be a path ("a.b.c") or an array of keys
export default function bindNode<T extends object>(
  object: T,
  key: string | string[],
  node: NodeInput,
  binder?: Binder | null,
  eventOptions?: BindNodeOptions
): T;
// { key: node } or { key: { node, binder } }; binder is the default for nodes without one
export default function bindNode<T extends object>(
  object: T,
  bindings: KeyNodeMap,
  binder?: Binder | null,
  eventOptions?: BindNodeOptions
): T;
// [{ key, node, binder, event }]; eventOptions are common to all items
export default function bindNode<T extends object>(
  object: T,
  bindings: BindingItem[],
  eventOptions?: BindNodeOptions
): T;
export default function bindNode(this: any, object: any, key?: any, node?: any, binder?: any, eventOptions?: any): any {
  // read and clear bindOptionalNode's flag first, so a call that throws doesn't leave it for the next one
  const { temporaryOptionalFlag } = bindNode as OptionalFlagHolder;

  delete (bindNode as OptionalFlagHolder).temporaryOptionalFlag;

  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = binder;
    binder = node;
    node = key;
    key = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'bindNode');
  }

  eventOptions = eventOptions || {};
  binder = binder || {};

  initMK(object);

  // throw an error when key is falsy
  if (!key) {
    throw matreshkaError('binding:falsy_key');
  }

  if (Array.isArray(key)) {
    if (typeof key[0] === 'string') {
      /*
       * accept array of keys
       * this.bindNode(['a', 'b', 'c'], node)
       */
      if (temporaryOptionalFlag) {
        eventOptions = { ...eventOptions, optional: true };
      }

      forEach(key as string[], (itemKey) => bindNode(object, itemKey, node, binder, eventOptions));
    } else {
      /*
       * accept array of objects
       * this.bindNode([{key, node, binder, event}], { silent: true });
       */
      forEach(key as BindingItem[], ({ key: itemKey, node: itemNode, binder: itemBinder, event: itemEventOptions }) => {
        const commonEventOptions: BindNodeOptions | undefined = node;
        const mergedEventOptions: BindNodeOptions = {};

        if (temporaryOptionalFlag) {
          mergedEventOptions.optional = true;
        }

        if (commonEventOptions) {
          // extend event object by "global" event
          assign(mergedEventOptions, commonEventOptions);
        }

        if (itemEventOptions) {
          // extend event object by "local" event ("event" key of an object)
          assign(mergedEventOptions, itemEventOptions);
        }

        bindNode(object, itemKey, itemNode, itemBinder, mergedEventOptions);
      });
    }

    return object;
  }

  if (typeof key === 'object') {
    forOwn(key as KeyNodeMap, (keyObjValue: any, keyObjKey) => {
      // binder means eventOptions
      if (temporaryOptionalFlag) {
        eventOptions = binder ? { ...binder, optional: true } : { optional: true };
      } else {
        eventOptions = binder;
      }

      if (keyObjValue && keyObjValue.constructor === Object && 'node' in keyObjValue) {
        // this.bindNode({ key: { node: $(), binder } ) }, { on: 'evt' }, { silent: true });
        bindNode(object, keyObjKey, keyObjValue.node, keyObjValue.binder || node, eventOptions);
      } else if (
        keyObjValue &&
        keyObjValue.constructor === Array &&
        keyObjValue.length &&
        keyObjValue[0].constructor === Object &&
        'node' in keyObjValue[0]
      ) {
        // this.bindNode({ key: [{
        //   node: $(),
        //   binder
        // }] ) }, { on: 'evt' }, { silent: true });
        forEach(keyObjValue as NodeWithBinder[], (keyObjValueItem) => {
          bindNode(object, keyObjKey, keyObjValueItem.node, keyObjValueItem.binder || node, eventOptions);
        });
      } else {
        // this.bindNode({ key: $() }, { on: 'evt' }, { silent: true });
        bindNode(object, keyObjKey, keyObjValue, node, eventOptions);
      }
    });

    return object;
  }

  const {
    optional = temporaryOptionalFlag || false, // check out bindOptionalNode
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
        bindNode
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

  // initMK above made the definition, so the property definition exists
  const propDef = defineProp(object, key) as PropDef;

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
