import type { AnyObject, Binder } from '../types.js';
import type { BindNodeOptions } from '../bindnode/types.js';
import parserData from './_parserdata.js';
import bindKey from '../bindnode/_bindkey.js';
import forEach from '../_helpers/foreach.js';

const textNodeBinder: Binder = {
  setValue(this: Node, value: any) {
    this.textContent = typeof value === 'undefined' ? '' : value;
  }
};

// adds binding for text node
// it splits up one text node into "simple text nodes"
// and "bound text nodes" and removes original text node
interface TextNodeData {
  object: AnyObject;
  node: Node;
  textNode: Node;
  eventOptions: BindNodeOptions;
}

export default function processTextNode({ object, node, textNode, eventOptions }: TextNodeData): void {
  const { bindingReg } = parserData;
  const { textContent } = textNode;
  const { document } = window;

  bindingReg.lastIndex = 0;

  // tokens variable contains normal text as odd items
  // and bound keys as even items
  // 'foo{{x}}bar{{y}}baz{{z}}' -> ['foo', 'x', 'bar', 'y', 'baz', 'z', '']
  const tokens = (textContent as string).split(bindingReg);

  // fragment contains all new text nodes
  const fragment = document.createDocumentFragment();

  forEach(tokens, (token, index) => {
    if (token) {
      const newTextNode = document.createTextNode(token);
      fragment.appendChild(newTextNode);

      // if tokens item is even then it is a key
      // which needs to be bound to newly created text node
      if (index % 2 !== 0) {
        bindKey(object, token, newTextNode, textNodeBinder, eventOptions);
      }
    }
  });

  node.insertBefore(fragment, textNode);
  node.removeChild(textNode);
}
