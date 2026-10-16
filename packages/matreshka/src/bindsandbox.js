import bindNode from './bindnode';
import unbindNode from './unbindnode';
import checkObjectType from './_helpers/checkobjecttype';

// binds or rebinds sandbox node
export default function bindSandbox(object, node, evt) {
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
