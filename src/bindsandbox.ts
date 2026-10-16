import type { BindNodeOptions, NodeInput } from './bindnode/types.js';
import bindNode from './bindnode/index.js';
import unbindNode from './unbindnode/index.js';
import checkObjectType from './_helpers/checkobjecttype.js';

// binds or rebinds sandbox node
export default function bindSandbox<T extends object>(object: T, node: NodeInput, eventOptions?: BindNodeOptions): T;
export default function bindSandbox(this: any, object: any, node?: any, evt?: any): any {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    evt = node;
    node = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'bindSandbox');
  }

  unbindNode(object, 'sandbox', null, evt);
  return bindNode(object, 'sandbox', node, null, evt);
}
