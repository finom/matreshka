import Matreshka from 'matreshka';

const { select, bindNode } = Matreshka;

const FIELDS = 'input, textarea, output, progress, select';

// a selector, HTML, a node or an array-like of nodes; the first node
function one(selector) {
  if (!selector) return null;
  if (typeof selector === 'string') {
    if (!/</.test(selector)) return document.querySelector(selector);
    const container = document.createElement('div');
    container.innerHTML = selector;
    return container.firstElementChild;
  }
  if (!selector.dispatchEvent && typeof selector.length === 'number') return selector[0];
  return selector;
}

// a form's fields: those inside it (form.elements misses <input type="image">) and those tied to it by the form attribute
function getFields(form) {
  const inside = form.querySelectorAll(FIELDS);

  if (form.nodeName !== 'FORM') {
    return inside;
  }

  const fields = new Set(Array.prototype.filter.call(inside, (field) => !field.form || field.form === form));

  for (const field of form.elements) {
    if (field.matches(FIELDS)) {
      fields.add(field);
    }
  }

  // document order
  return [...fields].sort((a, b) => (a.compareDocumentPosition(b) & form.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
}

function parseForm(object, selector, callback, eventOptions) {
  if (!object || (typeof object !== 'object' && typeof object !== 'function')) {
    throw new TypeError('parseForm should accept an object or a function as the first argument');
  }

  const form = /:sandbox|:bound/.test(selector) ? select(object, selector) : one(selector);

  if (!form) {
    return null;
  }

  const fields = getFields(form);

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const { name } = field;

    if (name) {
      bindNode(object, name, field, undefined, eventOptions);
      if (callback) {
        callback(name, field);
      }
    }
  }

  return form;
}

// a page with the Matreshka bundle gets Matreshka.parseForm
/* istanbul ignore if */
if (typeof globalThis.Matreshka === 'function') {
  globalThis.Matreshka.parseForm = parseForm;
}

export default parseForm;
