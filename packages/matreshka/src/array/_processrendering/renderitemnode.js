import parseBindings from '../../parsebindings';
import bindNode from '../../bindnode';
import releaseNode from './releasenode';
import renderedNodes from './renderednodes';
import triggerOne from '../../trigger/_triggerone';
import initMK from '../../_core/init';
import matreshkaError from '../../_helpers/matreshkaerror';
import getNodes from '../../bindnode/_getnodes';

const htmlTestReg = /</;

// when an item was rendered by an array and then removed from it, its sandbox still points to the removed node
// release that node so the item can be rendered again
function releaseStaleSandbox(item, itemDef, renderedInArrays, eventOptions) {
  const bindings = itemDef.props.sandbox?.bindings;
  const sandbox = bindings?.[0].node;

  if (sandbox && renderedNodes.has(sandbox) && !Object.values(renderedInArrays).includes(sandbox)) {
    releaseNode(item, sandbox, eventOptions);
  }
}

// the function makes the main rendering job
// it renders given array item
export default function renderItemNode({
  selfDef, // selfDef is passed as little optimization
  self,
  item,
  eventOptions
}) {
  const { renderer, bindRenderedAsSandbox = true } = item;
  const { itemRenderer } = self;
  let usedRenderer = renderer || itemRenderer;
  const rendererContext = usedRenderer === renderer ? item : self;
  const { id: selfId } = selfDef;
  const { moveSandbox, forceRerender, silent } = eventOptions;

  // if renderer is not found return null as a node
  if (!usedRenderer) {
    return { node: null };
  }

  const itemDef = initMK(item);
  const { renderedInArrays = {} } = itemDef;

  // if moveSandbox option is truthy then return a sandbox of an item
  if (moveSandbox) {
    const sandboxPropDef = itemDef.props.sandbox;
    if (sandboxPropDef) {
      const { bindings } = sandboxPropDef;
      const node = bindings ? bindings[0].node : null;

      if (node) {
        for (let i = 0, keys = Object.keys(renderedInArrays); i < keys.length; i++) {
          const key = keys[i];

          if (node === renderedInArrays[key]) {
            // delete an information about previous array
            delete renderedInArrays[key];
            break;
          }
        }

        renderedInArrays[selfId] = node;

        // moving sandbox does not fire "render" event but it fire "afterrender"
        // since "afterrender" means "node is inserted to DOM"
        return {
          node: node.__replacedByNode || node,
          itemEventOptions: {
            node,
            self: item,
            parentArray: self
          }
        };
      }
    }
  }

  itemDef.renderedInArrays = renderedInArrays;

  if (forceRerender && renderedInArrays[selfId]) {
    // drop the bindings to the node which is going to be replaced
    releaseNode(item, renderedInArrays[selfId], eventOptions);
  } else if (bindRenderedAsSandbox) {
    releaseStaleSandbox(item, itemDef, renderedInArrays, eventOptions);
  }

  // if usedRenderer is function then call it
  if (typeof usedRenderer === 'function') {
    usedRenderer = usedRenderer.call(rendererContext, item);
  }

  // if usedRenderer is string
  if (typeof usedRenderer === 'string') {
    if (!htmlTestReg.test(usedRenderer)) {
      // if usedRenderer is a selector
      const selector = usedRenderer;

      usedRenderer = getNodes(self, selector);

      if (usedRenderer.length) {
        // if a node is found by given selector then use its HTML
        usedRenderer = usedRenderer[0].innerHTML.trim();
      } else {
        // if not throw an error
        throw matreshkaError('array:renderer_node_missing', { selector });
      }
    } else {
      // if usedRenderer is HTML string
      usedRenderer = usedRenderer.trim();
    }
  }

  // pass a node or HTML
  const parsed = parseBindings(item, usedRenderer, eventOptions);

  // if parseBindings returned more/less than one node then throw an error
  if (parsed.length !== 1) {
    throw matreshkaError('array:rendered_number_nodes', { length: parsed.length });
  }

  const node = parsed[0];
  renderedInArrays[selfId] = node;
  renderedNodes.add(node);

  if (bindRenderedAsSandbox) {
    bindNode(item, 'sandbox', node, null, eventOptions);
  }

  // if silent is not truthy then fire 'render' event and virtual methods
  if (!silent) {
    const itemEventOptions = {
      node,
      self: item,
      parentArray: self
    };
    const { onRender } = item;
    const { onItemRender } = self;

    if (onRender) {
      onRender.call(item, itemEventOptions);
    }

    if (onItemRender) {
      onItemRender.call(self, item, itemEventOptions);
    }

    triggerOne(item, 'render', itemEventOptions);

    return { node: node.__replacedByNode || node, itemEventOptions };
  }

  return { node: node.__replacedByNode || node };
}
