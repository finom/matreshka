import Init from './_init';
import data from './_data';

// adds unique nodes to mq collection
export default function add(selector) {
  const idMap = {};

  let result;

  const nodes = new Init(selector);

  if (this.length) {
    result = new Init();
    for (let i = 0; i < this.length; i++) {
      const node = this[i];
      if (!node.b$) {
        data.nodeIndex += 1;
        node.b$ = data.nodeIndex;
      }
      const nodeID = node.b$;
      idMap[nodeID] = 1;
      result.push(node);
    }

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node.b$) {
        data.nodeIndex += 1;
        node.b$ = data.nodeIndex;
      }
      const nodeID = node.b$;
      if (!idMap[nodeID]) {
        idMap[nodeID] = 1;
        result.push(node);
      }
    }
  } else {
    result = nodes;
  }

  return result;
}
