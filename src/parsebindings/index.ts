import type { BindNodeOptions, NodeInput } from '../bindnode/types.js';
import checkObjectType from '../_helpers/checkobjecttype.js';
import { parseHTML, toNodes } from '../_dom/index.js';
import parserData from './_parserdata.js';
import processTextNode from './_processtextnode.js';
import processAttribute from './_processattribute/index.js';
import getNodes from '../bindnode/_getnodes.js';
import forEach from '../_helpers/foreach.js';
import assign from '../_helpers/assign.js';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

// makes parsing of given node (node, $(nodes), selector, HTML)
// and initializes bindings for attributes and text nodes which contain things like {{foo}}
export default function parseBindings(object: object, nodes: NodeInput, eventOptions?: BindNodeOptions): Node[];
export default function parseBindings(this: any, object: any, givenNodes?: any, eventOptions?: any): Node[] {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    eventOptions = givenNodes;
    givenNodes = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'parseBindings');
  }

  const extendedEventOptions: BindNodeOptions = {
    // useExactBinder is little optimization
    // without this option used binder is extended by default binder
    useExactBinder: true,
    fromParser: true,
    setValueOnBind: true
  };

  if (typeof eventOptions === 'object') {
    assign(extendedEventOptions, eventOptions);
  }

  let nodes: Node[] | undefined;
  // the template holding the nodes of an HTML string
  let htmlContent: ParentNode | null = null;
  const allNodes: Node[] = [];
  // extract all needed data from parserData
  // check out what is parserData in its module
  const { leftBracket, htmlLeftBrackets, bindingReg } = parserData;
  const hasBracket = (html: string) => htmlLeftBrackets.some((bracket) => html.includes(bracket));

  if (typeof givenNodes === 'string') {
    if (~givenNodes.indexOf('<')) {
      // this is HTML
      nodes = parseHTML(givenNodes);
      if (!~givenNodes.indexOf(leftBracket)) {
        // if it doesn't include parser bracket then we don't need to check
        // their existence for all included nodes in cycle below
        return nodes;
      }
      htmlContent = nodes[0]?.parentNode ?? null;
    } else {
      // this is a selector
      nodes = getNodes(object, givenNodes);
    }
  } else if (typeof givenNodes === 'object') {
    // this is a node, nodeList or something else (eg array, jQuery instance etc)
    nodes = toNodes(givenNodes);
  }

  // to make possible to not use recursion we're collecting all nodes to allNodes array
  // nodes of another kind (a number, undefined) throw here, as before
  forEach(nodes as Node[], (node) => allNodes.push(node));

  // on every cycle of array we're adding new descendants to allNodes
  // increasing # of needed iterations
  for (let i = 0; i < allNodes.length; i++) {
    const node = allNodes[i];

    // allow to parse elements only
    if (node.nodeType !== ELEMENT_NODE) {
      continue;
    }

    const { outerHTML, innerHTML, childNodes, attributes } = node as Element;

    // if outerHTML does't contain left bracket, then this node doesn't need to be parsed
    if (!hasBracket(outerHTML)) {
      continue;
    }

    // initialize bindings for attributes if they appear
    if (attributes.length) {
      // fixes Firefox issue: attributes.length can be changed by processAttribute
      const attrs: ArrayLike<Attr> = attributes.length > 1 ? Array.prototype.slice.call(attributes) : attributes;

      forEach(attrs, (attribute) => {
        if (bindingReg.test(attribute.value)) {
          processAttribute({
            node: node as Element,
            attribute,
            object,
            eventOptions: extendedEventOptions
          });
        }
      });
    }

    // if innerHTML does't contain left bracket,
    // then children of this node don't need to be parsed
    if (!hasBracket(innerHTML)) {
      continue;
    }

    // a copy: processTextNode inserts the bound text nodes, and a value holding "{{y}}" must stay text
    const children = Array.from(childNodes);
    for (let j = 0; j < children.length; j++) {
      const childNode = children[j];
      const { nodeType, textContent } = childNode;

      if (nodeType === ELEMENT_NODE) {
        // if childNode is HTML element then add it to the end of allNodes array
        // to check everything on next outer cycle iterations
        allNodes.push(childNode);
      } else if (nodeType === TEXT_NODE) {
        // if childNode is text node which contains things like {{x}}
        // then initialize bindings for this node
        if (bindingReg.test(textContent as string)) {
          processTextNode({
            object,
            node,
            textNode: childNode,
            eventOptions: extendedEventOptions
          });
        }
      }
    }
  }

  // a top-level text node of an HTML string ("{{a}} <b>{{b}}</b>") is split up too, so the nodes are read again
  if (htmlContent) {
    forEach(Array.from(htmlContent.childNodes), (textNode) => {
      if (textNode.nodeType === TEXT_NODE && bindingReg.test(textNode.textContent as string)) {
        processTextNode({
          object,
          node: htmlContent as ParentNode & Node,
          textNode,
          eventOptions: extendedEventOptions
        });
      }
    });

    return Array.from(htmlContent.childNodes);
  }

  return nodes as Node[];
}
