// After `npm run build`: runs test/legacy/scenario.js against dist/matreshka.min.js in a jsdom page without the
// JavaScript and DOM APIs IE 11 lacks (removed below), so a call to one of them fails here as it fails there.
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const fail = (message) => {
  console.error(`check-legacy-run: ${message}`);
  process.exit(1);
};

// what IE 11 has not
function toIE11(window) {
  const drop = (object, names) => {
    for (const name of names) {
      if (!object || !(name in object)) continue;
      delete object[name];
      if (name in object) fail(`can't remove ${name}`);
    }
  };
  // <template> parses as an unknown element: no content
  drop(Object.getPrototypeOf(window.document.createElement('template')), ['content']);
  drop(window, [
    'Symbol',
    'Reflect',
    'Promise',
    'Proxy',
    'WeakSet',
    'WeakRef',
    'globalThis',
    'queueMicrotask',
    'structuredClone',
    'HTMLTemplateElement',
    'CustomEvent'
  ]);
  drop(window.Object, [
    'assign',
    'is',
    'values',
    'entries',
    'fromEntries',
    'hasOwn',
    'getOwnPropertySymbols',
    'getOwnPropertyDescriptors'
  ]);
  // ES5's Object.keys: a primitive throws
  const { keys } = window.Object;
  window.Object.keys = (object) => {
    if (object === null || (typeof object !== 'object' && typeof object !== 'function')) {
      throw new window.TypeError('Object.keys: argument is not an Object');
    }
    return keys(object);
  };
  drop(window.Array, ['from', 'of']);
  drop(window.Array.prototype, [
    'includes',
    'find',
    'findIndex',
    'findLast',
    'findLastIndex',
    'fill',
    'copyWithin',
    'keys',
    'values',
    'entries',
    'flat',
    'flatMap',
    'at',
    'toSorted',
    'toReversed',
    'toSpliced',
    'with'
  ]);
  drop(window.String.prototype, [
    'includes',
    'startsWith',
    'endsWith',
    'repeat',
    'padStart',
    'padEnd',
    'replaceAll',
    'at',
    'trimStart',
    'trimEnd',
    'codePointAt',
    'normalize',
    'matchAll'
  ]);
  drop(window.Number, ['isNaN', 'isInteger', 'isFinite', 'isSafeInteger', 'parseFloat', 'parseInt']);
  drop(window.Math, ['trunc', 'sign', 'log10', 'log2', 'hypot', 'cbrt', 'expm1', 'fround', 'imul', 'clz32']);

  // Map, Set and WeakMap: no iterable argument, no iterators, set and add return undefined
  for (const name of ['Map', 'Set', 'WeakMap']) {
    const Native = window[name];
    // biome-ignore lint/complexity/useArrowFunction: called with new
    const IE11 = function () {
      return new Native();
    };
    IE11.prototype = Native.prototype;
    for (const method of ['set', 'add']) {
      const original = Native.prototype[method];
      if (original) {
        Native.prototype[method] = function (...args) {
          original.apply(this, args);
        };
      }
    }
    drop(Native.prototype, ['keys', 'values', 'entries']);
    window[name] = IE11;
  }

  // the DOM: msMatchesSelector instead of matches, no closest/remove/append…, no Event constructors,
  // contains only on elements, classList.toggle and add/remove take one class and toggle no second argument
  const { Element, Node, DOMTokenList, NodeList } = window;
  Element.prototype.msMatchesSelector = Element.prototype.matches;
  drop(Element.prototype, [
    'matches',
    'closest',
    'remove',
    'append',
    'prepend',
    'before',
    'after',
    'replaceWith',
    'toggleAttribute',
    'getAttributeNames'
  ]);
  drop(window.CharacterData.prototype, ['remove', 'before', 'after', 'replaceWith']);
  drop(window.DocumentType.prototype, ['remove', 'before', 'after', 'replaceWith']);
  drop(window.Document.prototype, ['append', 'prepend']);
  drop(window.DocumentFragment.prototype, ['append', 'prepend', 'children', 'firstElementChild']);
  drop(Node.prototype, ['isConnected', 'getRootNode']);
  drop(NodeList.prototype, ['forEach', 'keys', 'values', 'entries']);
  const contains = Node.prototype.contains;
  drop(Node.prototype, ['contains']);
  Element.prototype.contains = contains;
  const { toggle, add, remove } = DOMTokenList.prototype;
  DOMTokenList.prototype.toggle = function (token) {
    return toggle.call(this, token);
  };
  DOMTokenList.prototype.add = function (token) {
    add.call(this, token);
  };
  DOMTokenList.prototype.remove = function (token) {
    remove.call(this, token);
  };
  for (const name of ['Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'InputEvent', 'UIEvent']) {
    const Native = window[name];
    // biome-ignore lint/complexity/useArrowFunction: it has a prototype, as the constructor it replaces
    const notConstructor = function () {
      throw new window.TypeError("Object doesn't support this action");
    };
    notConstructor.prototype = Native.prototype;
    window[name] = notConstructor;
  }
}

const dom = new JSDOM('<!DOCTYPE html><body><pre id="legacy-report"></pre><div id="legacy-root"></div></body>', {
  url: 'http://localhost/',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  beforeParse: process.env.MODERN ? undefined : toIE11
});
const { window } = dom;
if (!process.env.MODERN)
  for (const name of ['Symbol', 'Promise', 'Reflect'])
    if (window.eval(`typeof ${name}`) !== 'undefined') fail(`${name} is still there`);

window.eval(readFileSync('dist/matreshka.min.js', 'utf8'));
window.eval(readFileSync('test/legacy/scenario.js', 'utf8'));

const started = Date.now();
while (!window.legacyResult && Date.now() - started < 30000) await new Promise((resolve) => setTimeout(resolve, 20));
const result = window.legacyResult;
if (!result) fail('the scenario did not finish');
if (result.failed.length) fail(`${result.failed.length} failed:\n${result.failed.join('\n')}`);
console.log(`check-legacy-run: ${result.passed} cases pass without the APIs IE 11 lacks`);
window.close();
