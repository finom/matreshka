import defs from './_core/defs';
import dom from './_dom';
import selectNodes from './bindnode/_selectnodes';
import toArray from './_helpers/toarray';
import checkObjectType from './_helpers/checkobjecttype';
import forEach from './_helpers/foreach';

const customSelectorTestReg = /:sandbox|:bound\(([^(]*)\)/;

// selects nodes based on given selector
export default function selectAll(object, selector) {
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
  let result = dom.$();

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
      const selected = node.querySelectorAll(selector);
      result = result.add(toArray(selected));
    });
  }

  return result;
}
