import defs from './_core/defs.js';
import selectNodes, { scopeToSandbox } from './bindnode/_selectnodes.js';
import checkObjectType from './_helpers/checkobjecttype.js';

const customSelectorTestReg = /:sandbox|:bound\(([^(]*)\)/;

// selects one node based on given selector
export default function select(object: object, selector: string): Node | null;
export default function select(this: any, object: any, selector?: any): Node | null {
  if (typeof this === 'object' && this.isMatreshka) {
    // when context is Matreshka instance, use this as an object and shift other args
    selector = object;
    object = this;
  } else {
    // throw error when object type is wrong
    checkObjectType(object, 'select');
  }

  // the selector includes "custom" things like :sandbox or :bound(KEY)
  if (customSelectorTestReg.test(selector)) {
    return selectNodes(object, scopeToSandbox(selector))[0] || null;
  }
  const def = defs.get(object);

  if (!def || typeof selector !== 'string') {
    return null;
  }

  const propDef = def.props.sandbox;

  if (!propDef) {
    return null;
  }

  const { bindings } = propDef;

  if (bindings) {
    // iterate over all bound nodes trying to find a descendant matched given selector
    for (let i = 0; i < bindings.length; i++) {
      const node = bindings[i].node;
      const selected = (node as Element).querySelector(selector);

      if (selected) {
        return selected;
      }
    }
  }

  return null;
}
