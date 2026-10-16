import type { AnyObject } from '../types.js';
import type { NodeInput } from './types.js';
import selectNodes from './_selectnodes.js';
import { toNodes } from '../_dom/index.js';

const htmlReg = /</;
const customSelectorReg = /:sandbox|:bound\(([^(]*)\)/;

// the function works just like DOM library accepting any kind of arg
// (HTML string, Node, NodeList etc) bu allows to pass custom selector
// eg :bound(KEY) and :sandbox
export default function getNodes(object: AnyObject, selector: NodeInput): Node[] {
  if (typeof selector === 'string' && !htmlReg.test(selector) && customSelectorReg.test(selector)) {
    return selectNodes(object, selector);
  }

  return toNodes(selector);
}
