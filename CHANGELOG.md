# Changelog

All notable changes to Matreshka.js are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Versions before 3.0.0 are on [GitHub Releases](https://github.com/finom/matreshka/releases).

## [Unreleased]

3.0.0 is a new major version: one package, written in TypeScript, ES modules only. The API of 2.x stays; the changes below say what moved and what was removed.

### Added

- An agent skill for AI coding agents: `npx skills add finom/matreshka`.
- Types for the whole API, generated from the TypeScript source. The types a custom binder or handler needs (`Binder`, `BindNodeOptions`, `EventOptions`, `Mediator` and others) are exported from `matreshka`.
- Named exports: `import { bindNode, calc, MatreshkaObject, MatreshkaArray } from 'matreshka'`, next to the default `Matreshka`.
- The router and the form parser are part of the package: `import { initRouter, Router } from 'matreshka/router'` and `import { parseForm } from 'matreshka/parse-form'`. The script-tag bundle has them as `Matreshka.initRouter`, `Matreshka.Router` and `Matreshka.parseForm`.
- The binders that came from the `common-binders` package are part of Matreshka (`Matreshka.binders`, `import { binders } from 'matreshka'`).

### Changed

- ES modules only. `require('matreshka')` works on Node.js versions that load ES modules with `require` (22.12 and later) and gives the module's exports (`const { Matreshka } = require('matreshka')`).
- The entry points are `matreshka`, `matreshka/router` and `matreshka/parse-form`; the deep paths of 2.x (`matreshka/bindnode`, `matreshka/array/from`) are gone.
- One script-tag bundle, `dist/matreshka.js` and `dist/matreshka.min.js` (also on jsDelivr and unpkg), with the router and the form parser in it.
- `$nodes` and the result of `selectAll` and `$` are arrays of nodes. 2.x returned a collection of its bundled jQuery-like library, or of jQuery when it was on the page.
- A change that comes from a node isn't written back into that node: clearing a field whose value a mediator turns into `0` leaves it empty, and the other nodes bound to the property show `0`.
- The code targets current browsers and Node.js; it is no longer compiled to ES5. It imports without a DOM (server-side rendering, Node.js, test runners without jsdom).
- `off()` with no arguments removes only the listeners added with `on`, `once` and `onDebounce`; bindings, `calc` dependencies and the built-in events of `Matreshka.Object` and `Matreshka.Array` keep working. It fires `removeevent`.
- `undefined` and `null` show as empty in the binders and in parsed `{{key}}` attributes, as they already did in parsed text.
- `Matreshka.Class`: a class without its own constructor calls the parent constructor with the same arguments, and a constructor written as a method (`constructor() {}`) or an ES class works.
- `copyWithin` on a rendered array throws, like `fill`, instead of leaving the DOM out of sync.
- `new Matreshka.Array(n)` throws a `RangeError` for an invalid length, like `new Array(n)`.

### Removed

- The packages `matreshka-router` and `matreshka-parse-form`: use `matreshka/router` and `matreshka/parse-form`.
- `Matreshka.useDOMLibrary` and the use of a global jQuery or Zepto. Matreshka works with the DOM directly; `bindNode` still accepts a jQuery object, or anything array-like, as nodes.
- The `MK` global alias of the script-tag bundle.
- The misspelled `Matreshka.parserBrackers`; the name is `Matreshka.parserBrackets`.

### Fixed

#### Events

- `off(name, callback)` removes DOM event handlers (`click::x`), also from nodes bound later, and keeps the other DOM events and the user's own `bind:KEY` listeners.
- `once()` on a DOM event fires only once, and a `once()` handler that fires its own event again runs only once.
- The same DOM event handler added twice is called once.
- Several delegated listeners on the same path (`a@change:x`, `a@change:y`) all follow a reassigned branch, and removing one delegated or `*@` listener keeps the others.
- Replacing a data value of a `Matreshka.Object` takes `*@` listeners off the old value.
- `off()` on an object without listeners no longer throws; `off()` on one object no longer misses its DOM handlers on a node another object also listens on.
- Adding or removing a DOM event listener fires `addevent:NAME` / `removeevent:NAME` under its own name; names like `addevent:click::x` are no longer treated as DOM events.
- Delegated `focus::KEY(selector)` and `blur::KEY(selector)` work with the built-in DOM library.
- `parseHTML` and `parseBindings` handle `<col>`.
- `off()` with no arguments stays fast with many listeners.
- Delegated and `*@` listeners keep working on a child that another data key, property or array slot still holds after one of them is replaced or removed.
- A function added both as a listener and as a delegated listener (`*@foo`) on the same object stays until both are removed.

#### Bindings

- Binding a radio group keeps the radio that is already checked; an unchecked radio no longer sets the value.
- `unbindNode(key, node)` keeps the other nodes bound to the key, and `nodes`/`$nodes` stay correct.
- `unbindNode` of a deep key (`a.b.c`) stops the binding for good, keeps other deep bindings on the same branch working, doesn't throw when the branch is gone, and honours `exactKey`; `unbindNode(null)` also removes deep bindings.
- After `unbindNode`, debounced updates still pending no longer reach the node or the property.
- The select binder selects the option "0" for the value 0; a `multiple` select accepts null and numeric values.
- `binders.existence()` bound to several nodes hides and restores all of them.
- `binders.style()` reads camel-cased properties from the computed style.
- Parsed attributes show values containing `$&` and `$$` literally, and custom parser brackets may contain regexp characters.
- Typing a value that a mediator turns into a number no longer writes it back into the same field.
- Selectors with `:sandbox` / `:bound()` support commas inside `:is()`, `:not()` and attribute values.
- A failed `bindOptionalNode` call no longer makes the next `bindNode` optional.
- `select(':sandbox')` and `$(':bound(x)')` on an object without bindings return an empty result instead of throwing.
- `sandbox` (and `container` of a `Matreshka.Array`) no longer appear in `Object.keys` or `JSON.stringify`.
- `binders.style()` works with dashed and custom property names; `null`, `undefined` or `''` removes the property.
- `selectAll(':sandbox, .foo')` on an object without bindings still returns the `.foo` nodes.
- A binder's `setValue` and `getValue` get the current value in `options.value`, not the value at bind time.
- Input typed into a node before a debounced write from code lands is kept: the older write is dropped.

#### Data

- `calc` with a deep source (`a.b.c`) no longer throws when a middle object becomes `null`, and calculated properties on different objects no longer block each other.
- `skipMediator`, `force`, `forceHTML` and `silentHTML` on a source no longer apply to the calculated target.
- With `promiseCalc`, the latest calculation wins over slower earlier ones, and a rejection reports the original error.
- `remove` returns the object, as documented, and takes delegated listeners and deep `calc` dependencies off the removed value.
- `toMatreshka` treats only arrays as arrays (a plain object with a `length` property becomes a `Matreshka.Object`) and copies only the data keys of a `Matreshka.Object`.
- Assigning a `Matreshka.Object` instance to an instantiated property copies only its data keys; assigning `{}` clears it.
- `Matreshka.Object`: `remove(key, { silent: true })` also removes the data key; keys named like `toString` work as data keys; `addDataKeys` and `removeDataKeys` move `*@` listeners; `removeDataKeys` fires `remove` before `modify`; `off('change')` no longer breaks its `set`, `modify` and `remove` events.
- Instances made by `Matreshka.Class` no longer list `constructor` in `for...in`.

#### Matreshka.Array

- `splice(start)` with one argument removes all items from `start`, and passes the real index of each added item to `Model` and the item mediator.
- A rendered item can be added again after it was removed (`push`, `unshift`, `splice`, filtered views with `recreate`, moving to another array).
- `Model` and `itemRenderer` declared as class fields work.
- `trackBy` keeps a tracked item when it moves to an index the old array didn't have.
- Rerendering releases every binding to the old item nodes, deep (`a.b`) and exact-key ones included, and no longer throws when an item is also bound to `window` or another non-DOM target.
- Changing `Model` on a rendered array rerenders the converted items and runs the render hooks (`onRender`, `onItemRender`, `render`, `afterrender`).
- `pull` with a negative or fractional index removes nothing, removing an `undefined` item fires the events, and `pull` returns `null` when nothing is removed.
- `fill` applies `Model` and the item mediator, honours start and end, and reports the replaced items as `removed`.
- `Matreshka.Array.of` and `Matreshka.Array.from` apply the subclass's `Model`.
- `splice` inserts a new item's node in the right place when a primitive sits next to it, and removing an item no longer throws when its node is outside the current container.
- `splice` puts new nodes in the right place when the last added value appears again later in the array.
- Removing an item hidden by the `existence` binder also removes its placeholder comment.
- `recreate()` with the same items in another order moves their nodes into the new order.

#### Router

- The back button updates the properties when it returns to the first page entry or to an entry the router didn't push.
- The history router keeps the query string when it changes the path.
- Values with spaces, non-Latin letters or slashes are encoded in the URL and decoded back.
- A property that is `null` or `''` when it subscribes gets its value from the URL.
- A plain anchor such as `#top` is no longer read as a route.
- Subscribing a shorter route no longer drops the deeper parts of the URL.
- `router.parts` no longer holds `undefined` entries, and three or more slashes in a row are treated like one.

#### Form parser

- When the form isn't found, `parseForm` returns `null` and binds nothing; before, it bound every field of the document.
- A wrong first argument throws `parseForm`'s own `TypeError`.
- `parseForm` binds every field of a form, including `<input type="image">` and fields tied to it with the `form` attribute.

[Unreleased]: https://github.com/finom/matreshka/compare/v2.4.0...HEAD
