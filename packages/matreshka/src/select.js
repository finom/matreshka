import defs from './_core/defs';
import selectNodes from './bindnode/_selectnodes';
import checkObjectType from './_helpers/checkobjecttype';

const customSelectorTestReg = /:sandbox|:bound\(([^(]*)\)/;

// selects one node based on given selector
export default function select(object, selector) {
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
    return selectNodes(object, selector)[0] || null;
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
      const selected = node.querySelector(selector);

      if (selected) {
        return selected;
      }
    }
  }

  return null;
}
