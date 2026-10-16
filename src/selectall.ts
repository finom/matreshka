import defs from './_core/defs.js';
import { uniqueNodes } from './_dom/index.js';
import selectNodes from './bindnode/_selectnodes.js';
import checkObjectType from './_helpers/checkobjecttype.js';
import forEach from './_helpers/foreach.js';

const customSelectorTestReg = /:sandbox|:bound\(([^(]*)\)/;

// selects nodes based on given selector
export default function selectAll(object: object, selector: string): Node[];
export default function selectAll(this: any, object: any, selector?: any): Node[] {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    selector = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'selectAll or $');
  }

  // the selector includes "custom" things like :sandbox or :bound(KEY)
  if (customSelectorTestReg.test(selector)) {
    return selectNodes(object, selector);
  }

  const def = defs.get(object);
  let result: Node[] = [];

  if (!def || typeof selector !== 'string') {
    return result;
  }

  const propDef = def.props.sandbox;

  if (!propDef) {
    return result;
  }

  const { bindings } = propDef;

  if (bindings) {
    // iterate over all bindings and add found nodes
    forEach(bindings, ({ node }) => {
      const selected = (node as Element).querySelectorAll(selector);
      result = uniqueNodes(result, selected);
    });
  }

  return result;
}
