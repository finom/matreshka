---
name: matreshka
description: Write and fix code that uses Matreshka.js 3 (the `matreshka` package) — reactive data binding of plain JavaScript objects to existing HTML, from a script tag or npm. Use when a project imports `matreshka`, loads matreshka.min.js, or the user asks to add two-way binding, computed values or rendered lists to server-rendered HTML.
---

# Matreshka.js 3

Matreshka binds properties of plain objects to DOM elements. Assigning a property updates its elements; user input updates the property. No virtual DOM, no templates, no build step needed. Docs: https://matreshka.js.org (append `llms-full.txt` for the whole reference).

## Load it

- Script tag (global `Matreshka`, router and form parser included):
  `<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>`
- npm: `npm install matreshka`, then named imports:
  `import { bindNode, calc, on, mediate, binders, MatreshkaObject, MatreshkaArray } from 'matreshka';`
- Router: `import { initRouter, Router } from 'matreshka/router';` Form parser: `import { parseForm } from 'matreshka/parse-form';` In the script-tag bundle: `Matreshka.initRouter`, `Matreshka.Router`, `Matreshka.parseForm`.
- ESM only. Only these three entry points exist: never write deep imports such as `matreshka/bindnode` or `matreshka/binders/html` (2.x paths, removed).

## Two styles, same functions

Functions take the object first; the `Matreshka` class has the same functions as methods on `this`.

```js
const { bindNode, calc, binders } = Matreshka;
const page = {};
bindNode(page, 'name', '.name');                         // input <-> page.name
calc(page, 'greeting', 'name', (name) => name || 'stranger');
bindNode(page, 'greeting', '.greeting', binders.text()); // span shows page.greeting
```

```js
class Page extends Matreshka {
  constructor() {
    super();
    this.bindNode('name', '.name').calc('greeting', 'name', (name) => name || 'stranger');
  }
}
```

Prefer the functions on a plain object for a few bindings on an existing page; use classes for larger parts and for list items.

## Core API

- `bindNode(obj, key, selectorOrNode, binder?, options?)` or `bindNode(obj, { key: selector, ... })`. Form fields (input, textarea, select, output, progress) get a binder automatically. If the property is undefined, its initial value is read from the element, so server-filled forms become the initial state.
- `calc(obj, target, sources, handler, options?)` — `target` recomputes when any source changes. A source can be `'key'`, `['a', 'b']`, or `{ object: other, key: 'x' }` for another object.
- `mediate(obj, keys, fn)` — every new value passes through `fn` (`Number`, `String`, `Boolean`, a custom function).
- `on(obj, names, handler)`, `once`, `onDebounce`, `off`, `trigger(obj, name, ...args)`.
- `set(obj, key, value, options)` — assign with event options, e.g. `{ silent: true }` to skip events.
- `bindSandbox(obj, root)` — then `:sandbox .child` selectors resolve inside `root`. `select(obj, selector)` returns one element or null; `selectAll` returns an array.
- `instantiate(obj, key, Class)` keeps `obj[key]` an instance of `Class` on assignment.
- `parseForm(obj, formSelector)` binds every named field of the form to the property of the same name.
- `initRouter(obj, '/a/b/')` syncs `obj.a`, `obj.b` with `#!/a-value/b-value/`; pass `'history'` as the third argument for pathname routing.

## Binders (`Matreshka.binders` / `import { binders }`)

`text(map?)`, `html(map?)`, `attr(name, map?)`, `prop(name, map?)`, `className(name, switcher = true)`, `display(switcher = true)`, `existence(switcher = true)`, `style(property, map?)`, `dataset(prop, map?)`, and form binders `input(type?)`, `textarea()`, `select(multiple?)`, `output()`, `progress()`. Pass one as the fourth argument of `bindNode`. A custom binder is an object `{ on, getValue, setValue, initialize, destroy }`; add your own with `Matreshka.binders.myBinder = (...args) => ({ ... })`.

## Events

- `change:KEY`, `beforechange:KEY`, `bind:KEY`, `delete:KEY`.
- DOM events of bound elements: `click::KEY`, delegated `click::KEY(.selector)`, sandbox `click::(.selector)`.
- Delegated object events: `a.b@change:c` (nested), `*@modify` (every item of a `Matreshka.Array`/`Object`).

## Lists: Matreshka.Array

```js
class Users extends Matreshka.Array {
  get Model() { return User; }          // items become User instances
  get itemRenderer() { return '<li>{{name}}</li>'; } // HTML, a selector, or a function
  constructor(data) {
    super();
    this.bindNode('sandbox', '.users').recreate(data);
  }
}
```

Native array methods (`push`, `splice`, `sort`, …) update the DOM. `recreate(newItems)` replaces the content and keeps the nodes of items that stay, in the new order. `{{key}}` in the renderer binds `key` of each item. `trackBy` keeps items with the same id across `recreate`.

## Behavior to rely on (3.0)

- Updates to the DOM are debounced by default (one task later). In tests, wait a tick, or pass `{ debounceSetValue: false, debounceGetValue: false }` as options.
- `calc` computes the target at once, then recomputes one task after a source changes. In tests, wait a tick, or pass `{ debounceCalc: false }` as its options.
- A change that came from an element is not written back to that element: with `mediate(obj, 'x', Number)`, clearing the field leaves it empty while `obj.x` becomes `0`.
- `$nodes`, `selectAll` return plain arrays. Inputs may be a selector, an element, a NodeList, a jQuery object or any array-like.
- A radio bound by `bindNode` holds the `value` of the checked radio, not a boolean; a checkbox holds a boolean.
- No `MK` alias, no `useDOMLibrary`, no jQuery dependency.
