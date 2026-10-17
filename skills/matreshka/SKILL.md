---
name: matreshka
description: Write and fix code that uses Matreshka.js 3 (the `matreshka` package) — reactive two-way data binding of plain JavaScript objects to existing HTML, from a script tag, a CDN ES module or npm. Use when a project imports `matreshka`, loads matreshka.min.js, or the user asks to add two-way binding, computed values, rendered lists, routing or form binding to an HTML page.
---

# Matreshka.js 3

Matreshka binds properties of JavaScript objects to DOM elements. Assigning a property updates its elements; user input updates the property. It works on the HTML that is already on the page: no virtual DOM, no template compiler, no build step required. It has zero dependencies. Everything below is the whole API; nothing else is needed to use it.

## 1. Pick the setup

| The project is… | Do this |
| --- | --- |
| A plain `.html` file, no build tools | A `<script>` tag with `matreshka.min.js` (A). Use the global `Matreshka`. |
| A page that already uses `<script type="module">`, no bundler | Import the one-file ES module from the CDN (B). |
| An npm project (Vite, webpack, Rollup, esbuild, Parcel…) | `npm install matreshka`, named imports (C). |
| TypeScript | Same as C; types ship with the package (D). |
| Node.js tests or server-side rendering | Same as C, with a DOM such as jsdom (E). |
| Code written for Matreshka 2.x or seemple | Rewrite the imports (F). |

The latest version is 3.x. Never pin `matreshka@2` in new code.

### A. Plain HTML file (script tag)

The bundle defines one global, `Matreshka`, with everything on it, the router and the form parser included (`Matreshka.initRouter`, `Matreshka.Router`, `Matreshka.parseForm`). Put the script before your own code, at the end of `<body>` or with `defer` on both.

```html
<!doctype html>
<html>
  <body>
    <input class="name" placeholder="Your name">
    <p>Hello, <span class="greeting"></span>!</p>

    <script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
    <script>
      const { bindNode, calc, binders } = Matreshka;
      const app = {};
      bindNode(app, 'name', '.name');
      calc(app, 'greeting', 'name', (name) => name || 'stranger');
      bindNode(app, 'greeting', '.greeting', binders.text());
    </script>
  </body>
</html>
```

It weighs about 73 kB minified, 24 kB gzipped, 21 kB with brotli (what a CDN sends). It runs in the browsers jQuery 4 supports, Internet Explorer 11 included; for IE 11 the page's own code must be ES5 too (`var` and `function`, no arrows, classes or template strings), and a `Matreshka.Array` there has only the array methods IE 11 has (no `includes`, `find`, `at`…). The same file is on unpkg: `https://unpkg.com/matreshka@3/dist/matreshka.min.js`. For an offline copy, download that file next to the page and use `<script src="matreshka.min.js">`.

### B. CDN ES module, no bundler

`matreshka.min.mjs` is the whole library as one minified ES module: every named export of `matreshka` plus `initRouter`, `Router` and `parseForm`, and the default export is `Matreshka` with them attached. One request, the same size as the script-tag file.

```html
<script type="module">
  import { bindNode, calc, binders, MatreshkaArray, initRouter, parseForm } from 'https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.mjs';
</script>
```

Import only that file: the per-module files under `dist/` (`dist/index.js` and the rest) are for bundlers, and loading them from a CDN means about 170 unminified requests. To keep the npm import names, map all three to the one file with an import map:

```html
<script type="importmap">
  {
    "imports": {
      "matreshka": "https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.mjs",
      "matreshka/router": "https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.mjs",
      "matreshka/parse-form": "https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.mjs"
    }
  }
</script>
<script type="module">
  import Matreshka, { bindNode } from 'matreshka';
  import { initRouter } from 'matreshka/router';
</script>
```

### C. npm and a bundler

```sh
npm install matreshka
```

```js
import Matreshka, { bindNode, calc, on, mediate, binders, MatreshkaObject, MatreshkaArray } from 'matreshka';
import { initRouter, Router } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

- Exactly three entry points exist: `matreshka`, `matreshka/router`, `matreshka/parse-form`. Every function and class is a named export of `matreshka`; the default export is the `Matreshka` class (also exported as `Matreshka`).
- The package is ESM. Node.js 22.12+ can also `require('matreshka')` (it returns the module namespace: `const { Matreshka, bindNode } = require('matreshka')`).
- `"sideEffects": false`: bundlers drop what you don't import.

### D. TypeScript

Types ship with the package; no `@types` package. Works with `moduleResolution` `bundler`, `nodenext`/`node16` and the older `node`. Exported types: `Binder`, `BindingOptions`, `EventOptions`, `EventHandler`, `Mediator`, `NodeInput`, `BindNodeOptions`, `CalcSource`, `CalcHandler`, `CalcEventOptions`, `CalcDefinition`, `EventNames`, `EventHandlerMap`, `ItemRenderer`, `ModelConstructor`, `ArrayMethodOptions`, `SetDataOptions`; `RouterType` from `matreshka/router`.

```ts
import { MatreshkaObject, MatreshkaArray, type ItemRenderer } from 'matreshka';

class Todo extends MatreshkaObject<{ title: string; done: boolean }> {}

class Todos extends MatreshkaArray<Todo> {
  override get Model() {
    return Todo;
  }
  itemRenderer: ItemRenderer = '<li>{{title}}</li>';
  constructor() {
    super();
    this.bindNode('sandbox', '.todos');
  }
}
```

- `MatreshkaObject<Data>` types `setData`, `keys`, `toJSON` and iteration; `MatreshkaArray<Item>` types the items.
- Properties added at run time (by `bindNode`, `calc`, `setData`) are not known to TypeScript. Declare them as class fields (`name = '';`) or give the class an interface.
- Write `Model` as a getter (`override get Model()`); `itemRenderer` needs no `override` (a field, a getter or a method all work).

### E. Node.js tests and server-side rendering

Matreshka needs `window` and `document`. In Vitest or Jest use the `jsdom` environment; elsewhere create a jsdom window before importing. Updates are asynchronous (see section 3), so tests wait a tick or turn the delays off:

```js
const tick = () => new Promise((resolve) => setTimeout(resolve));
bindNode(obj, 'x', input, null, { debounceSetValue: false, debounceGetValue: false });
calc(obj, 'y', 'x', (x) => x * 2, { debounceCalc: false });
```

For server-rendered HTML, the client restores the state from the page: `bindNode` reads each element's value into a property that is still `undefined`, and `Matreshka.Array#restore` rebuilds a list from its rendered nodes.

### F. Code written for 2.x or seemple

| Old | Matreshka 3 |
| --- | --- |
| `import bindNode from 'matreshka/bindnode'`, `'matreshka/binders/html'`, any deep path | `import { bindNode, binders } from 'matreshka'` |
| `matreshka-router`, `matreshka-parse-form` packages | `matreshka/router`, `matreshka/parse-form` |
| `seemple`, `Seemple`, `seemple-router`… | `matreshka`, `Matreshka`, `matreshka/router`… |
| `MK`, `Matreshka.useDOMLibrary`, `parserBrackers` | Gone. Use `Matreshka`; `$nodes` are plain arrays; `parserBrackets` |
| `require('matreshka')` returning the class | `require('matreshka').Matreshka` (or `.default`) |

## 2. Two styles, the same functions

Every method of the `Matreshka` class also exists as a function that takes the target object first. Both return the target, so calls chain.

```js
// functions on a plain object: good for a few bindings on an existing page
const page = {};
bindNode(page, 'name', '.name');
calc(page, 'greeting', 'name', (name) => name || 'stranger');
```

```js
// a class: good for widgets, larger apps and list items
class Page extends Matreshka {
  constructor() {
    super();
    this.bindNode('name', '.name').calc('greeting', 'name', (name) => name || 'stranger');
  }
}
```

`Matreshka.chain(object)` gives the method style for a plain object: `chain(obj).calc('a', 'b', (b) => b * 2).set('b', 3).bindNode('c', '.node')`.

The classes:

- `Matreshka`: the base class with bindings, events, `calc`, `mediate`, `instantiate`.
- `Matreshka.Object` (`MatreshkaObject`): key-value data; knows which keys are data (for `toJSON` and `modify` events).
- `Matreshka.Array` (`MatreshkaArray`): a real array subclass with every array method; renders its items into the DOM.

Use the class in `extends`, call `super()` first in the constructor, and never read `this` before it.

## 3. Behavior to rely on

- **Updates are debounced.** Writing a bound property updates the element one task later; an input event updates the property one task later; `calc` recomputes one task after a source changes. Several writes in a row cause one update. Read the result after `await new Promise((r) => setTimeout(r))`, in an event handler, or turn the delays off with the flags in section 4.
- **The first sync is immediate.** At `bindNode`, a property that is `undefined` takes the element's value (`getValue`); a defined property is written to the element (`setValue`). `calc` computes its target at once.
- **Only form elements get a binder automatically:** `input` (every type), `textarea`, `select`, `output`, `progress`. Any other element needs a binder, usually `binders.text()`, `binders.html()`, `binders.className(...)`, `binders.display()`, `binders.attr(...)`, `binders.prop(...)`. Binding a `<span>` without one changes nothing on screen.
- **A checkbox holds a boolean. A radio group holds the `value` of the checked radio:** bind all radios of the group to one key. A `select multiple` holds an array of values. `input type="number"` and `range` give strings unless mediated (`mediate(obj, 'x', Number)`).
- **A value typed by the user is not written back to the same element.** With `mediate(obj, 'x', Number)`, clearing the field leaves it empty while `obj.x` becomes `0`; typing `5abc` keeps the text while `obj.x` is `NaN`. Other elements bound to `x` are updated. A mediator that changes the typed text (a clamp, upper case) is written back, and the caret stays in place.
- **Assigning the same value fires nothing** (`Object.is`). Pass `{ force: true }` to `set` to fire anyway.
- **Only reactive keys are watched.** A key becomes reactive (an accessor) when it is first used by `bindNode`, `calc`, `mediate`, `instantiate`, `on('change:KEY')`, a `PATH@` listener or `setData`. A brand-new plain assignment (`obj.other = 1`) fires nothing, and the `change` event (any key) fires only for reactive keys.
- **A missing element throws** `Binding error: node is missing for key "x"`. Use `bindOptionalNode` for elements that may be absent.
- **A selector is resolved once**, at `bindNode`. Elements added to the page later are not bound; bind them then, or render them with `Matreshka.Array`.
- `$nodes` and `selectAll` return plain arrays. A node argument may be a selector, an element, an array, a NodeList, an HTMLCollection, a jQuery object or any array-like.
- Keys with dots are paths: `bindNode(obj, 'user.name', el)` follows `obj.user.name`, and keeps following when `obj.user` is replaced by another object. Pass `{ exactKey: true }` to use a dotted key as is.

## 4. Bindings

### bindNode

```js
bindNode(object, key, node, binder?, eventOptions?)   // function
this.bindNode(key, node, binder?, eventOptions?)     // method
```

- `node`: a selector, an element or a collection. Many-to-many: several elements per key, several keys per element.
- `binder`: how to sync (below). Omitted: found in `Matreshka.defaultBinders` (form elements). A partial binder extends the default one: `bindNode(obj, 'q', 'input.search', { on: 'change' })` keeps the default `getValue`/`setValue` and syncs on `change` instead of `input`. Pass `{ useExactBinder: true }` in `eventOptions` to use the given binder alone.
- Fires `bind` and `bind:KEY`; custom keys of `eventOptions` reach their handlers.

Other call forms:

```js
// an object of key: node pairs; the second argument is the binder for entries without one
bindNode(obj, {
  name: '.name',
  bio: { node: '.bio', binder: binders.html() },
  tags: [{ node: '.tags' }, { node: '.tags-count', binder: binders.text() }]
}, defaultBinder?, eventOptions?);

// an array of bindings; keep it to unbind the same list later
const bindings = [
  { key: 'a', node: '.a' },
  { key: 'b', node: '.b', binder: binders.text(), event: { silent: true } }
];
bindNode(obj, bindings, commonEventOptions?);
unbindNode(obj, bindings);
```

`bindNode` flags (in `eventOptions`):

| Flag | Default | Effect |
| --- | --- | --- |
| `silent` | `false` | No `bind` events |
| `exactKey` | `false` | A key with dots is a plain key, not a path |
| `getValueOnBind` | auto | `true`: read the element even if the property is defined; `false`: never read at bind |
| `setValueOnBind` | auto | `true`: write the element even if the property is `undefined`; `false`: never write at bind |
| `debounceSetValue` | `true` | `false`: write the element synchronously on every change |
| `debounceGetValue` | `true` | `false`: update the property synchronously on every input event |
| `debounceSetValueOnBind`, `debounceGetValueOnBind` | `false` | `true`: debounce the first sync too |
| `debounceSetValueDelay`, `debounceGetValueDelay` | `0` | Delay in ms of the debounced write or read |
| `useExactBinder` | `false` | Don't merge the given binder with the default one |

### Related binding functions

- `bindOptionalNode(obj, key, node, binder?, eventOptions?)`: same as `bindNode`, but a missing element is skipped silently.
- `unbindNode(obj, key, node?, eventOptions?)`: removes the binding of `key` to `node` (or to every node when `node` is omitted). `key` may be an array of keys, the object form or the array form above; `null` removes every binding of the object. Calls the binder's `destroy`. Fires `unbind`, `unbind:KEY`.
- `bindSandbox(obj, node, eventOptions?)`: binds the special key `sandbox`, unbinding the previous sandbox first.
- `select(obj, selector)`: the first matching element inside the sandbox, or `null`. `selectAll(obj, selector)` (method alias `this.$(selector)`): all matching elements, as an array.
- `this.nodes.KEY`: the first element bound to `KEY`. `this.$nodes.KEY`: all of them, as an array. Only Matreshka instances have them; with a plain object keep your own reference or use `select`/`selectAll`.

### The sandbox

The sandbox is the root element of a widget: `bindNode(obj, 'sandbox', '.my-widget')` or `bindSandbox(obj, '.my-widget')`.

- `:sandbox` in any selector means the sandbox element: `bindNode(obj, 'name', ':sandbox .name')`.
- `select`/`selectAll` search inside it.
- DOM event names get a short form (section 6).
- `sandbox` takes one element. Reading or assigning `obj.sandbox` throws; the element is `obj.nodes.sandbox`. It is left out of `Object.keys` and `JSON.stringify`.
- `:bound(KEY)` in a selector means the element bound to `KEY`: `bindNode(obj, 'title', ':bound(card) h2', binders.text())`.

### parseBindings and the {{ }} syntax

`parseBindings(obj, nodeOrHtmlOrSelector, eventOptions?)` turns `{{key}}` in the DOM into bindings and returns the nodes (an array):

```html
<div class="card">
  <h2>{{user.name}}</h2>                          <!-- a text binding, path supported -->
  <input value="{{query}}">                       <!-- two-way; also <textarea value="{{x}}">, <select value="{{x}}"> -->
  <input type="checkbox" checked="{{done}}">      <!-- two-way boolean -->
  <a href="/users/{{user.id}}">profile</a>        <!-- an attribute built from several keys (one-way) -->
</div>
```

```js
parseBindings(app, '.card');
const nodes = parseBindings(app, '<h3>Hello, {{name}}</h3>'); // an HTML string gives new, unattached nodes
```

The existing nodes stay (listeners are kept); only the `{{ }}` parts become bindings. `Matreshka.parserBrackets` changes the brackets: `parserBrackets.left = '[['; parserBrackets.right = ']]';` (useful when a server template engine already uses `{{ }}`). An `itemRenderer` template is parsed the same way.

## 5. Binders

A binder tells `bindNode` how to sync one element. Every function is called with the element as `this`.

```js
const binder = {
  on: 'input change',               // DOM event names (space-separated) that mean "the element changed",
                                    // or a function (handler, options) that wires the listener itself
  getValue(options) { return this.value; },       // element → property
  setValue(value, options) { this.value = value; }, // property → element
  initialize(options) {},           // once, before the binding starts (init a widget here)
  destroy(options) {}               // on unbindNode
};
```

`options` holds `self` (the object), `key`, `value`, `node`, `$nodes`. A binder without `getValue`/`on` is one-way (property → element); without `setValue` it is one-way the other way. `text`, `html`, `attr`, `prop`, `dataset` and `style` also have `getValue`: a property that is still `undefined` at `bindNode` takes the element's current content (an empty string for an empty element), so give the property its value first or let the mapping function handle `''`.

Built-in binder creators, in `Matreshka.binders` (`import { binders } from 'matreshka'`). `mappingFn` transforms the value before it is shown:

| Binder | Element change |
| --- | --- |
| `text(mappingFn?)` | `textContent`; `null`/`undefined` show as empty |
| `html(mappingFn?)` | `innerHTML` (only for trusted strings) |
| `attr(name, mappingFn?)` | an attribute; `null`/`undefined` set it empty |
| `prop(name, mappingFn?)` | a DOM property (`prop('disabled')`, `prop('hidden')`) |
| `dataset(name, mappingFn?)` | `dataset[name]` (`dataset('userId')` → `data-user-id`) |
| `style(cssProperty, mappingFn?)` | an inline style, camel-cased (`style('backgroundColor')`) |
| `className(name, bool = true)` | adds the class when the value is truthy (`bool = false`: when falsy) |
| `display(bool = true)` | shows the element when the value is truthy, hides it with `style.display` otherwise (`bool = false`: the reverse) |
| `existence(bool = true)` | like `display`, but removes the element from the DOM and puts it back |
| `input(type?)`, `textarea()`, `select(multiple = false)`, `output()`, `progress()` | two-way form binders; chosen automatically, needed only to force one |

```js
bindNode(todo, 'done', ':sandbox', binders.className('completed'));
bindNode(app, 'loading', '.spinner', binders.display());
bindNode(app, 'avatar', 'img.avatar', binders.attr('src'));
bindNode(app, 'total', '.total', binders.text((total) => `$${Number(total).toFixed(2)}`));
```

A custom binder for a third-party widget, made reusable through `Matreshka.binders`:

```js
Matreshka.binders.slider = (min, max) => ({
  on: 'slide',
  getValue() { return $(this).slider('value'); },
  setValue(value) { $(this).slider('value', value); },
  initialize() { $(this).slider({ min, max }); }
});
bindNode(app, 'volume', '.volume', Matreshka.binders.slider(0, 100));
```

`Matreshka.defaultBinders` is the array of functions `(node) => binder | undefined` that `bindNode` tries, in order, when no binder is given. `defaultBinders.unshift(fn)` adds a rule that wins over the built-in ones:

```js
Matreshka.defaultBinders.unshift((node) => {
  if (node.classList.contains('rich-editor')) return myEditorBinder();
});
```

`Matreshka.lookForBinder(node)` returns the binder `bindNode` would choose, or `undefined`.

## 6. Events

```js
on(obj, names, handler, triggerOnInit = false, context?)
on(obj, { 'change:a': handlerA, 'click::b': handlerB }, triggerOnInit?, context?)
once(obj, names, handler, context?)                       // runs once, then removes itself
onDebounce(obj, names, handler, delay = 0, triggerOnInit = false, context?) // runs once per burst
off(obj, names?, handler?, context?)                      // no names: removes every handler added with on/once/onDebounce
trigger(obj, names, ...args)                              // fire a custom event; args reach the handlers
```

`names` is one name or several separated by spaces. `triggerOnInit = true` also calls the handler right away. Adding the same handler with the same context to the same event twice adds it once.

Event names:

| Name | When |
| --- | --- |
| `change:KEY`, `change` | after a property changes (`change` for any reactive key) |
| `beforechange:KEY`, `beforechange` | before it changes |
| `bind:KEY`, `bind`, `unbind:KEY`, `unbind` | after a binding is added or removed |
| `delete:KEY`, `delete` | after `remove(obj, key)` |
| `addevent:NAME`, `addevent`, `removeevent:NAME`, `removeevent` | a handler was added or removed |
| `DOMEVENT::KEY` | a DOM event on the elements bound to `KEY`: `'click::saveButton'` |
| `DOMEVENT::KEY(SELECTOR)` | delegated: on elements matching `SELECTOR` inside those bound to `KEY`: `'click::list(.remove)'` |
| `DOMEVENT::(SELECTOR)` | delegated inside the sandbox: `'click::(.remove)'` |
| `PATH@EVENT` | an event of a nested object: `'user@change:name'`, `'a.b.c@change:d'` |
| `*@EVENT` | an event of every item of a `Matreshka.Array` or every data value of a `Matreshka.Object`: `'*@change:done'`, `'*@click::(.remove)'`; `'*.b.*@change:c'` also works |
| `modify`, `set`, `remove`, `add`, `addone`, `removeone`, `recreate`, `sort`, `push`… | collection events (sections 8 and 9) |

Delegated listeners follow the path: replacing `obj.user` moves `'user@change:name'` to the new object.

The handler of a property event receives one event object: `value`, `previousValue`, `key`, `self` (the object), plus every custom key from the `eventOptions` that caused the change. A DOM event handler (`click::x`) receives an object with `self` (the object), `node` (the bound element), `key`, `domEvent` (the browser event), `target`, `which`, `ctrlKey`, `altKey`, and `preventDefault()`/`stopPropagation()`; in an item's event (`*@click::(.remove)`) `self` is the item. A `trigger` handler receives the arguments given to `trigger`.

```js
on(app, 'change:query', (evt) => console.log(evt.previousValue, '→', evt.value));
on(app, 'click::(.clear)', (evt) => { evt.preventDefault(); app.query = ''; });
set(app, 'query', 'x', { source: 'url' }); // the handler sees evt.source === 'url'
```

## 7. Values: set, calc, mediate, instantiate, remove

### set

```js
set(obj, key, value, eventOptions?)
set(obj, { a: 1, b: 2 }, eventOptions?)
```

Assignment with options. Plain assignment (`obj.a = 1`) is the same as `set` without options. Flags:

| Flag | Effect |
| --- | --- |
| `silent` | no `change`/`beforechange` events (bound elements and `calc` still update) |
| `silentHTML` | don't update bound elements |
| `force` | fire `change` even when the value is the same |
| `forceHTML` | update bound elements even when the value is the same (after `<option>`s were added to a bound `select`) |
| `skipMediator` | don't run the mediator |
| `skipCalc` | don't recompute the `calc` targets that depend on this key |
| any other key | custom data for the handlers |

### calc

```js
calc(obj, target, source, handler = (v) => v, eventOptions?)
```

Keeps `target` computed from the sources. The handler gets the source values in the order they are listed. Source forms:

```js
calc(obj, 'full', ['first', 'last'], (first, last) => `${first} ${last}`);
calc(obj, 'total', 'cart.sum');                                      // a path into nested objects
calc(obj, 'sum', { object: other, key: ['a', 'b'] }, (a, b) => a + b); // another object
calc(obj, 'x', [{ object: obj, key: 'a' }, { object: other, key: 'b' }], (a, b) => a * b);
```

Several targets in one call: `calc(obj, { x: { source: ['a', 'b'], handler: (a, b) => a + b }, y: { source: 'x', event: { debounceCalc: false } } }, commonEventOptions?)`.

Cycles are allowed and settle (`p` from `a, b` and `a` from `p, b` both work). Flags:

| Flag | Default | Effect |
| --- | --- | --- |
| `debounceCalc` | `true` | `false`: recompute synchronously on every source change |
| `debounceCalcDelay` | `0` | delay in ms |
| `debounceCalcOnInit` | `false` | `true`: the first computation is debounced too |
| `setOnInit` | `true` | `false`: don't compute until a source changes |
| `exactKey` | `false` | source keys with dots are plain keys |
| `promiseCalc` | `false` | the handler returns a Promise; the target takes the resolved value; a newer computation wins over an older pending one |
| custom keys | | reach the `change:TARGET` handlers |

A source changed with `silent` changes the target silently too.

```js
calc(app, 'results', 'query', async (query) => (await fetch(`/search?q=${encodeURIComponent(query)}`)).json(), {
  promiseCalc: true,
  debounceCalcDelay: 300
});
```

### mediate

```js
mediate(obj, key, (value, previousValue, key, obj) => newValue)
mediate(obj, ['a', 'b'], Number)
mediate(obj, { age: Number, name: String, admin: Boolean })
```

Every value assigned to the key passes through the function first, including values typed into bound elements. The current value is converted right away.

```js
mediate(app, 'percent', (v) => Math.min(100, Math.max(0, Number(v) || 0)));
```

### instantiate

```js
instantiate(obj, key, Class, updateCallback?)
instantiate(obj, { settings: Settings, friends: Friends }, updateCallback?)
```

Keeps `obj[key]` an instance of `Class`: the current value becomes `new Class(value, obj, key)`, and a later assignment updates that instance instead of replacing it:

- a `Matreshka.Object` subclass gets the data through `setData`;
- a `Matreshka.Array` subclass through `recreate`;
- another class gets the properties copied onto it (`Object.assign`);
- with `updateCallback(instance, data)`, that function does the update.

This is how a big app is shaped: one tree of objects, each branch made with `instantiate`, so `app.data = freshDataFromServer` updates everything in place and keeps the bindings.

### remove

`remove(obj, key, eventOptions?)` (or an array of keys) deletes a property with its bindings and listeners. Fires `delete`, `delete:KEY`. On a `Matreshka.Object` it also removes the data key and fires `remove`, `modify`.

## 8. Matreshka.Object

Key-value data that knows which keys are data. `toJSON`, `keys`, `values`, `entries`, `each`, `for…of` and the `modify` event cover only data keys; other properties (UI state, computed values) stay out.

```js
class User extends Matreshka.Object {
  constructor(data) {
    super(data); // = this.setData(data)
    this.calc('fullName', ['first', 'last'], (f, l) => `${f} ${l}`); // fullName is not data
  }
}
const user = new User({ first: 'Ann', last: 'Lee' });
JSON.stringify(user); // {"first":"Ann","last":"Lee"}
```

| Member | Does |
| --- | --- |
| `new Matreshka.Object(data?)` | creates; `data` becomes data keys |
| `setData(key, value, eventOptions?)`, `setData({ … }, eventOptions?)` (alias `jset`) | sets values and marks the keys as data; `{ replaceData: true }` makes these the only data keys |
| `addDataKeys(keys)` | marks keys as data without setting values (an array or several arguments) |
| `removeDataKeys(keys)` | unmarks keys (the properties stay) |
| `isDataKey(key)` | `true` for a data key |
| `keys()`, `values()`, `entries()` | arrays of the data |
| `each((value, key) => …, thisArg?)` | iterates the data |
| `keyOf(value)` | the first data key with that value, or `null` |
| `toJSON(recursive = true)` | a plain object; nested values with `toJSON` are converted too |
| `isMatreshkaObject` | always `true` |

Events: `set` (a data key was set or added), `remove` (a data key was removed), `modify` (after either). `'*@change:x'` listens to every data value.

`Matreshka.toMatreshka(data)` converts a plain tree: arrays become `Matreshka.Array`, other objects `Matreshka.Object`.

## 9. Matreshka.Array and rendering lists

A `Matreshka.Array` is an array: indexes, `length`, every `Array.prototype` method (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`, `copyWithin`, `map`, `filter`, `slice`, `concat`, `find`, `findLast`, `at`, `includes`, `indexOf`, `reduce`, `toSorted`, `flat`…). Methods that return a new array return a `Matreshka.Array`; `forEach` returns the array itself; `keys`, `values`, `entries` return arrays.

```js
class Users extends Matreshka.Array {
  get Model() { return User; }                  // items become User instances
  itemRenderer = '<li><b>{{name}}</b> <button class="remove">×</button></li>';
  constructor(data) {
    super();
    this.bindNode('sandbox', '.users')          // items render into .users
      .on('*@click::(.remove)', (evt) => this.pull(evt.self))
      .recreate(data);
  }
}
const users = new Users([{ name: 'Ann' }, { name: 'Bob' }]);
users.push({ name: 'Cid' });                    // a third <li> appears
users[0].name = 'Anna';                         // the first <li> updates
```

### Rendering

- **Where:** into the `container` key if bound (`this.bindNode('container', '.list')`), else into the `sandbox`. Use `container` when the sandbox holds more than the list (a header, a counter).
- **What:** `itemRenderer`, defined by you as a class field, a getter or a method. Its value (or the method's return value, called with the item) is one of:
  - an HTML string with one root element (`'<li>{{name}}</li>'`); `{{ }}` bindings are parsed against the item;
  - a selector of a template whose `innerHTML` is the HTML (`'#user-template'` for `<template id="user-template">` or `<script type="text/html" id="user-template">`; a string with `<` is HTML, otherwise a selector; `:sandbox` works);
  - a DOM node.
  A `renderer` property on an item overrides `itemRenderer` for that item. Assigning a new `itemRenderer` rerenders every item (`set(this, 'itemRenderer', html, { forceRerender: false })` renders only the items that have no node yet).
- **The rendered node becomes the item's sandbox,** so inside the item `:sandbox .x` and `'click::(.x)'` work. Set `bindRenderedAsSandbox = false` on the item class when one item is rendered by several arrays (then use `evt.parentArray` in the render handler to know which).
- **After rendering,** declare the item's bindings in one of:
  - `onRender(evt)` method of the item class;
  - `onItemRender(item, evt)` method of the array class;
  - `render` event of the item (`'*@render'` on the array).
  `afterrender` fires after the node is in the container. The event object has `node`, `self` (the item) and `parentArray`.
- Items don't need to be Matreshka instances: plain objects render too; bind them with the function style in `onItemRender` (`bindNode(item, 'x', ':sandbox .x')` works there).
- `renderIfPossible = false` turns rendering off for the array. `rerender({ forceRerender: true })` renders every node again; without the flag it only re-inserts nodes (useful when items were added before the container existed).
- Moving an item to another array with its node: `other.push_(item, { moveSandbox: true })`.
- `restore(selector?, eventOptions?)`: builds the items from nodes already on the page (server-rendered), one item per node, the node as its sandbox; without a selector it takes the container's children. The item's `onRender` reads values from the node (with `bindNode`, a property that is `undefined` takes the element's value).

```js
class Item extends Matreshka.Object {
  onRender() {
    this.bindNode('title', ':sandbox .title', binders.text()); // reads "Milk" from the page
  }
}
class List extends Matreshka.Array {
  get Model() { return Item; }
  itemRenderer = '<li><span class="title"></span></li>';
  constructor() {
    super().bindNode('sandbox', '.list').restore(':sandbox li');
  }
}
```

### Items

- `Model`: the class of the items; added plain objects become `new Model(data, array, index)`. Write it as a getter (`get Model() { return User; }`): as a class field it only applies after the constructor's `super()`, so items passed to `super(...items)` are converted on the next change. Changing `Model` converts the existing items.
- `mediateItem(fn)`: like `Model` but any function; `fn(item, index)` returns the item to store (`this.mediateItem(Number)`, or choose the class per item). Converts existing items too. Overrides `Model`.
- `trackBy`: a key of unique ids (`trackBy = 'id'`). `recreate(newData)` then updates the item with the same id instead of creating a new one, keeps its node, and reorders the nodes to the new order. `'$index'` matches by position.

### Methods beyond Array.prototype

| Method | Does |
| --- | --- |
| `recreate(items = [], eventOptions?)` | replaces the content (with `trackBy`, reusing matching items); nodes of kept items stay; `recreate()` empties the array |
| `pull(indexOrItem, eventOptions?)` | removes one item by index or by identity; returns it or `null` |
| `orderBy(keys, orders = 'asc')` | sorts by item properties, like lodash's `orderBy`: `orderBy(['name', 'age'], ['asc', 'desc'])`; fires `sort` |
| `toJSON(recursive = true)` | a plain array |
| `Matreshka.Array.from(arrayLike, mapFn?, thisArg?)`, `.of(...items)` | create an instance; on a subclass they create the subclass |
| `isMatreshkaArray` | always `true` |

`new Matreshka.Array(3)` creates three empty slots, like `Array`; `new Matreshka.Array('a', 'b')` creates two items. A subclass constructor usually takes data and calls `recreate(data)` (or `super(...data)`).

### Event options on array methods: `METHOD_`

Every modifying method has a twin ending in `_` that takes event options as the last argument: `push_(a, b, { silent: true })`, `splice_(0, 1, { myFlag: 1 })`, `pop_({ silent: true })`. Flags: `silent` (no events), `dontRender` (no DOM changes), `skipItemMediator` (no `Model`/`mediateItem`), `moveSandbox` (keep the item's node), plus custom keys.

### Array events

| Event | When | Event object |
| --- | --- | --- |
| the method name (`push`, `splice`, `sort`, `pull`, `recreate`…) | after that method | `method`, `added`, `removed` |
| `add` / `addone` | items were added (once per call / once per item) | `added` / `addedItem` |
| `remove` / `removeone` | items were removed | `removed` / `removedItem` |
| `modify` | after any change, sorting included | `added`, `removed` |
| `change:length` | the length changed (`length` can be bound: `bindNode(this, 'length', '.count', binders.text())`) | |
| `*@EVENT` | an event of any item | |

## 10. Router (`matreshka/router`, `Matreshka.initRouter`)

```js
initRouter(obj, '/section/id/')            // hash routing: #!/section/id/
initRouter(obj, '/section/id/', 'history') // pathname routing through the History API
```

Each part of the route is a key of `obj`; the URL and the keys stay in sync both ways. With the URL `#!/users/42/`, `obj.section === 'users'` and `obj.id === '42'` (strings); `obj.id = '7'` changes the URL to `#!/users/7/`. Values are URI-encoded in the URL and decoded in the keys. A key set to `null` or `''` cuts the URL there (later parts are dropped). `*` skips a part: `initRouter(obj, '/*/id/')`. Several objects can subscribe to different parts of one URL. Hash routing ignores a plain anchor (`#top`); only `#!` hashes are routes. For history routing, the server must serve the page for every route path.

`Router.hash` and `Router.history` are the two router instances (Matreshka objects): `parts` (an array), `path` (`'/users/42/'`), `hashPath` (`'#!/users/42/'`, hash router only). They can be bound like any object: `bindNode(Router.hash, 'path', '.current-path', binders.text())`.

```js
const app = {};
initRouter(app, '/page/');
bindNode(app, 'isHome', '.home', binders.display());
calc(app, 'isHome', 'page', (page) => !page || page === 'home');
```

## 11. Form parser (`matreshka/parse-form`, `Matreshka.parseForm`)

```js
parseForm(obj, formSelectorOrNode, callback?, eventOptions?) // returns the form element, or null if not found
```

Binds every named field (`input`, `textarea`, `select`, `output`, `progress` with a `name` attribute) of a form, or of any container, to the property of the same name. Fields already filled on the page give their values to properties that are `undefined`. `callback(name, field)` runs for each bound field. Radios with one name bind to one key (the checked value); fields with names like `user.email` bind to paths.

```html
<form class="signup">
  <input name="email" type="email">
  <input name="password" type="password">
  <input name="agree" type="checkbox">
  <button class="submit" disabled>Sign up</button>
</form>
```

```js
const form = {};
parseForm(form, '.signup');
calc(form, 'valid', ['email', 'password', 'agree'], (email, password, agree) =>
  /\S+@\S+/.test(email) && password.length >= 8 && agree);
bindNode(form, 'valid', '.submit', binders.prop('disabled', (valid) => !valid));
```

## 12. Matreshka.Class

For code that can't use `class` syntax: `Matreshka.Class(prototype, statics?)` returns a constructor. `extends` in the prototype names the parent; `constructor` is the constructor (without one, the parent constructor runs with the same arguments).

```js
const Counter = Matreshka.Class({
  extends: Matreshka,
  constructor(start) {
    this.count = start;
  },
  increment() {
    this.count++;
  }
}, { create: (start) => new Counter(start) });
```

## 13. Recipes

- **Show a value as text:** `bindNode(obj, 'x', '.x', binders.text())`.
- **A computed value shown on the page:** `calc` it, then bind it with `binders.text()`.
- **Two inputs, one value:** bind both to the same key.
- **Show or hide:** `binders.display()`, or `binders.existence()` to remove it from the DOM; `binders.className('active')` for a class.
- **Disable a button:** `binders.prop('disabled', (ok) => !ok)`.
- **A number from an input:** `mediate(obj, 'x', Number)` (an empty field gives `0`; use `(v) => v === '' ? null : Number(v)` to keep empty as `null`).
- **React to typing, not on every key:** `onDebounce(obj, 'change:query', search, 300)`.
- **A list from server data:** a `Matreshka.Array` subclass with `Model`, `itemRenderer`, `trackBy = 'id'`; call `recreate(json)` on each response.
- **A count of done items:** `this.on('modify *@change:done', () => { this.doneCount = this.filter((todo) => todo.done).length; }, true)` (`true` runs it once right away).
- **Save to localStorage:** `on(list, 'modify *@change', () => localStorage.setItem('todos', JSON.stringify(list)))`; restore with `list.recreate(JSON.parse(localStorage.getItem('todos') || '[]'))`.
- **An element that may be absent:** `bindOptionalNode`.
- **Clean up a widget:** `unbindNode(obj, null)` removes all bindings; `off(obj)` removes the handlers added with `on`.

## 14. Mistakes to avoid

- Deep imports (`matreshka/bindnode`, `matreshka/binders/html`), `MK`, `require('matreshka')` as the class, `seemple`: all 2.x or older.
- Binding a non-form element without a binder.
- Reading the DOM or a `calc` target right after a change, before the next task.
- Reading or assigning `obj.sandbox`; binding two elements to `sandbox`.
- A `Model` class field when items are passed to `super(...items)`; use a getter.
- Using `this` before `super()`.
- Expecting `bindNode('.selector')` to bind elements added later.
- `binders.html()` with user input (XSS); use `binders.text()`.
- `input type="number"` values used as numbers without `mediate(…, Number)`.
- `Array.prototype` methods that return a new array (`map`, `filter`) return a `Matreshka.Array` that is not rendered; that's fine for computing, but render lists from the array that has the `itemRenderer`.
