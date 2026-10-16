// The DOM work Matreshka needs, without a DOM library: node lists are arrays of unique nodes, HTML is parsed through
// <template>, and delegated listeners are kept per node in a WeakMap, so a removed node takes its listeners with it.
import type { NodeInput } from '../bindnode/types.js';

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
const nonBubblingReg = /^(focus|blur)$/;
const scopeAttr = `${Math.random().toString().replace('0.', 'x')}y`; // x12345y

// the nodes of HTML; <template> parses rows, cells and options without wrapping them
export function parseHTML(html: string): Node[] {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return Array.from(template.content.childNodes);
}

// nodes from a selector, HTML, a node, window or anything array-like (NodeList, jQuery, an array)
export function toNodes(input: NodeInput): Node[] {
  if (!input) return [];
  // window isn't a Node, but it is kept in the same list
  if ((input as Node).nodeType || input === globalThis.window) return [input as Node];
  if (typeof input === 'string') {
    return /</.test(input) ? parseHTML(input) : Array.from(document.querySelectorAll(input));
  }
  if (typeof (input as ArrayLike<Node>).length === 'number') return Array.from(input as ArrayLike<Node>);
  return [input as Node];
}

// the nodes of every list once, in order
export function uniqueNodes(...lists: ArrayLike<Node>[]): Node[] {
  return [...new Set(lists.flatMap((list) => Array.from(list)))];
}

// the delegated selector matches only inside the node the listener is on
function matchesInside(node: Element, target: Element, selector: string): boolean {
  const scoped = selector
    .split(',')
    .map((part) => `[${scopeAttr}] ${part},[${scopeAttr}] ${part} *`)
    .join(',');
  node.setAttribute(scopeAttr, '');
  try {
    return Boolean(target.matches?.(scoped));
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

    // focus and blur don't bubble, so a delegated listener catches them at capture phase
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
