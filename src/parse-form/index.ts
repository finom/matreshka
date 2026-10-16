import type { BindNodeOptions } from '../bindnode/types.js';
import bindNode from '../bindnode/index.js';
import select from '../select.js';

const FIELDS = 'input, textarea, output, progress, select';

// what parseForm binds: input, textarea, output, progress or select
type FormField = Element & { name?: string; form?: HTMLFormElement | null };

// a selector, HTML, a node or an array-like of nodes
export type FormInput = string | Node | ArrayLike<Node> | null | undefined;

// a selector, HTML, a node or an array-like of nodes; the first node
function one(selector: FormInput): Element | null {
  if (!selector) return null;
  if (typeof selector === 'string') {
    if (!/</.test(selector)) return document.querySelector(selector);
    const container = document.createElement('div');
    container.innerHTML = selector;
    return container.firstElementChild;
  }
  if (!(selector as Node).dispatchEvent && typeof (selector as ArrayLike<Node>).length === 'number') {
    return (selector as ArrayLike<Node>)[0] as Element;
  }
  return selector as Element;
}

// a form's fields: those inside it (form.elements misses <input type="image">) and those tied to it by the form attribute
function getFields(form: Element): ArrayLike<FormField> {
  const inside = form.querySelectorAll<FormField>(FIELDS);

  if (form.nodeName !== 'FORM') {
    return inside;
  }

  const fields = new Set(Array.prototype.filter.call(inside, (field: FormField) => !field.form || field.form === form));

  for (const field of (form as HTMLFormElement).elements) {
    if (field.matches(FIELDS)) {
      fields.add(field);
    }
  }

  // document order
  return [...fields].sort((a, b) => (a.compareDocumentPosition(b) & form.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
}

// binds the named fields of a form (or any container) to the properties of their names; returns the form
function parseForm(
  object: object,
  selector: FormInput,
  callback?: ((name: string, field: Element) => void) | null,
  eventOptions?: BindNodeOptions
): Element | null {
  if (!object || (typeof object !== 'object' && typeof object !== 'function')) {
    throw new TypeError('parseForm should accept an object or a function as the first argument');
  }

  const form = /:sandbox|:bound/.test(selector as string)
    ? (select(object, selector as string) as Element | null)
    : one(selector);

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

export { parseForm };
