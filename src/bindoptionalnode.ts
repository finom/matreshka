import type { Binder } from './types.js';
import type { BindingItem, BindNodeOptions, KeyNodeMap, NodeInput, OptionalFlagHolder } from './bindnode/types.js';
import bindNode from './bindnode/index.js';
import apply from './_helpers/apply.js';

// TODO: Adds a binding, not throwing an error when a node is missing
export default function bindOptionalNode<T extends object>(
  object: T,
  key: string | string[],
  node: NodeInput,
  binder?: Binder | null,
  eventOptions?: BindNodeOptions
): T;
export default function bindOptionalNode<T extends object>(
  object: T,
  bindings: KeyNodeMap,
  binder?: Binder | null,
  eventOptions?: BindNodeOptions
): T;
export default function bindOptionalNode<T extends object>(
  object: T,
  bindings: BindingItem[],
  eventOptions?: BindNodeOptions
): T;
export default function bindOptionalNode(this: any): any {
  // this hack allows to keep bindOptionalNode as compact as possible
  // and doesn't require to flip args and support all bindNode variations
  (bindNode as OptionalFlagHolder).temporaryOptionalFlag = true;
  return apply(bindNode, this, arguments);
}
