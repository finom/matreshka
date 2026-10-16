import defs from '../_core/defs';
import toArray from '../_helpers/toarray';
import forEach from '../_helpers/foreach';
import dom from '../_dom';

const customSelectorReg = /\s*:bound\(([^(]*)\)\s*([\S\s]*)\s*|\s*:sandbox\s*([\S\s]*)\s*/;
const randomAttr = `${Math.random().toString().replace('0.', 'x')}y`; // x12345y

// splits a selector list by its top-level commas, keeping the ones inside :is(), [attr="a,b"] etc
function splitSelectorList(selectorList) {
  const selectors = [];
  let depth = 0;
  let quote = null;
  let start = 0;

  for (let i = 0; i < selectorList.length; i++) {
    const char = selectorList[i];

    if (quote) {
      if (char === '\\') {
        i += 1;
      } else if (char === quote) {
        quote = null;
      }
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === '(' || char === '[') {
      depth += 1;
    } else if (char === ')' || char === ']') {
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      selectors.push(selectorList.slice(start, i));
      start = i + 1;
    }
  }

  selectors.push(selectorList.slice(start));

  return selectors;
}

// the function selects nodes based on a selector (including custom values, eg :sandbox)
// TODO: selectNodes looks not good, it needs to be refactored and accelerated if possible
export default function selectNodes(object, givenSelector) {
  let result = dom.$();
  const def = defs.get(object);
  // an object without bindings has no :sandbox or :bound(KEY) nodes; plain selectors of the list still select
  const props = def ? def.props : {};
  const selectors = splitSelectorList(givenSelector);

  forEach(selectors, (selector) => {
    const execResult = customSelectorReg.exec(selector);
    if (execResult) {
      const boundKey = execResult[3] !== undefined ? 'sandbox' : execResult[1];
      const subSelector = execResult[3] !== undefined ? execResult[3] : execResult[2];
      const propDef = props[boundKey];

      if (propDef) {
        const { bindings } = propDef;
        if (bindings) {
          const boundNodes = Array(bindings.length);
          forEach(bindings, (binding, i) => {
            boundNodes[i] = binding.node;
          });

          // if native selector passed after :bound(KEY) is not empty string
          // for example ":bound(KEY) .my-selector"
          if (subSelector) {
            // if native selector contains children selector
            // for example ":bound(KEY) > .my-selector"
            if (subSelector.indexOf('>') === 0) {
              // selecting children
              forEach(boundNodes, (node) => {
                node.setAttribute(randomAttr, randomAttr);
                const selected = node.querySelectorAll(`[${randomAttr}="${randomAttr}"] ${subSelector}`);
                result = result.add(toArray(selected));
                node.removeAttribute(randomAttr);
              });
            } else {
              // if native selector doesn't contain children selector
              forEach(boundNodes, (node) => {
                const selected = node.querySelectorAll(subSelector);
                result = result.add(toArray(selected));
              });
            }
          } else {
            // if native selector is empty string just add bound nodes to result
            result = result.add(boundNodes);
          }
        }
      }
    } else {
      // if it's native selector (no custom things)
      result = result.add(selector);
    }
  });

  return result;
}
