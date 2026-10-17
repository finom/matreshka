import type { Binder } from '../types.js';
import type {
  BindingItem,
  BindNodeOptions,
  KeyNodeMap,
  NodeInput,
  NodeWithBinder,
  OptionalFlagHolder
} from './types.js';
import initMK from '../_core/init.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import forOwn from '../_helpers/forown.js';
import forEach from '../_helpers/foreach.js';
import matreshkaError from '../_helpers/matreshkaerror.js';
import assign from '../_helpers/assign.js';
import bindKey from './_bindkey.js';

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
        eventOptions = { ...binder, optional: true };
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

  return bindKey(object, key, node, binder, eventOptions, temporaryOptionalFlag);
}
