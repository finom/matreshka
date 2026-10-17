// The DOM work Matreshka needs, without a DOM library: node lists are arrays of unique nodes, HTML is parsed through
// <template> (a wrapping <div> on IE 11), and delegated listeners are kept per node in a WeakMap, so a removed node
// takes its listeners with it.
import type { NodeInput } from '../bindnode/types.js';
import toArray from '../_helpers/toarray.js';
import forEach from '../_helpers/foreach.js';

// what listen added to a node
interface ListenerItem {
  name: string;
  selector: string | null;
  handler: DomHandler;
  listener: DomHandler;
  capture: boolean;
}

// a DOM event handler; "this" is the node the listener is on
export type DomHandler = (this: any, evt: any) => void;

const listeners = new WeakMap<EventTarget, ListenerItem[]>();
const nonBubblingReg =
  /^(focus|blur|mouseenter|mouseleave|pointerenter|pointerleave|load|error|scroll|toggle|invalid)$/;
const scopeAttr = `${Math.random().toString().replace('0.', 'x')}y`; // x12345y

// the parents rows, cells and options need where there is no <template> (from jQuery)
const wrapMap: Record<string, [number, string, string]> = {
  option: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  area: [1, '<map>', '</map>']
};
wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// the nodes of HTML; <template> parses rows, cells and options without wrapping them
export function parseHTML(givenHTML: string): Node[] {
  const html = givenHTML.trim();
  const template = document.createElement('template') as HTMLTemplateElement;
  if (template.content) {
    template.innerHTML = html;
    return toArray(template.content.childNodes);
  }

  const tag = /<([\w:]+)/.exec(html);
  const [depth, before, after] = (tag && wrapMap[tag[1].toLowerCase()]) || [0, '', ''];
  let node: Element = document.createElement('div');
  node.innerHTML = before + html + after;
  for (let i = 0; i < depth; i++) node = node.children[0];
  return toArray(node.childNodes);
}

// nodes from a selector, HTML, a node, window or anything array-like (NodeList, jQuery, an array)
export function toNodes(input: NodeInput): Node[] {
  if (!input) return [];
  // window isn't a Node, but it is kept in the same list
  if ((input as Node).nodeType || (typeof window !== 'undefined' && input === window)) return [input as Node];
  if (typeof input === 'string') {
    return /</.test(input) ? parseHTML(input) : toArray(document.querySelectorAll(input));
  }
  if (typeof (input as ArrayLike<Node>).length === 'number') return toArray(input as ArrayLike<Node>);
  return [input as Node];
}

// the nodes of every list once, in order
export function uniqueNodes(...lists: ArrayLike<Node>[]): Node[] {
  const seen = new Set<Node>();
  const result: Node[] = [];
  forEach(lists, (list) =>
    forEach(list, (node) => {
      if (!seen.has(node)) {
        seen.add(node);
        result.push(node);
      }
    })
  );
  return result;
}

// Element#matches, msMatchesSelector on IE 11; false for a node that has neither (text, document, window)
export function matches(node: any, selector: string): boolean {
  const method = node.matches || node.msMatchesSelector;
  return Boolean(method?.call(node, selector));
}

// Element#closest, which IE 11 lacks
function closest(node: any, selector: string): Element | null {
  for (let current = node; current && current.nodeType === 1; current = current.parentNode) {
    if (matches(current, selector)) return current;
  }
  return null;
}

// the parts of a selector list, split at the commas outside brackets, parentheses and quotes
function splitSelectorList(selector: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote = '';
  let start = 0;
  for (let i = 0; i < selector.length; i++) {
    const char = selector[i];
    if (quote) {
      if (char === '\\') i++;
      else if (char === quote) quote = '';
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '\\') i++;
    else if (char === '(' || char === '[') depth++;
    else if (char === ')' || char === ']') depth--;
    else if (char === ',' && depth === 0) {
      parts.push(selector.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(selector.slice(start));
  return parts;
}

// the delegated selector matches only inside the node the listener is on
function matchesInside(node: Element, target: Element, selector: string): boolean {
  // document, a fragment or window can't take the scope attribute; everything is inside them
  if (!node.setAttribute) {
    const found = closest(target, selector);
    return Boolean(found && (!(node as Node).contains || (node as Node).contains(found)));
  }
  const scoped = splitSelectorList(selector)
    .map((part) => `[${scopeAttr}] ${part},[${scopeAttr}] ${part} *`)
    .join(',');
  node.setAttribute(scopeAttr, '');
  try {
    return matches(target, scoped);
  } finally {
    node.removeAttribute(scopeAttr);
  }
}

// adds a listener once per node, name, selector and handler
export function listen(
  node: EventTarget,
  names: string,
  givenSelector: string | null | undefined,
  handler: DomHandler
): void {
  const selector = givenSelector || null;
  const list = listeners.get(node) || [];
  listeners.set(node, list);

  for (const name of names.split(/\s+/)) {
    if (list.some((item) => item.name === name && item.handler === handler && item.selector === selector)) continue;

    // focus, blur, mouseenter and the like don't bubble, so a delegated listener catches them at capture phase
    const capture = Boolean(selector) && nonBubblingReg.test(name);
    const listener = selector
      ? function delegated(this: Element, evt: Event) {
          if (matchesInside(this, evt.target as Element, selector)) handler.call(this, evt);
        }
      : handler;

    list.push({ name, selector, handler, listener, capture });
    node.addEventListener(name, listener, capture);
  }
}

// removes what listen added
export function unlisten(
  node: EventTarget,
  names: string,
  givenSelector: string | null | undefined,
  handler: DomHandler
): void {
  const selector = givenSelector || null;
  const list = listeners.get(node);
  if (!list) return;

  for (const name of names.split(/\s+/)) {
    for (let i = list.length - 1; i >= 0; i--) {
      const item = list[i];
      if (item.name === name && item.handler === handler && item.selector === selector) {
        node.removeEventListener(name, item.listener, item.capture);
        list.splice(i, 1);
      }
    }
  }
}
