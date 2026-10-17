# Architecture

Matreshka.js makes plain object properties reactive and binds them to DOM nodes the page already has.

## The parts

- **Definitions** (`src/_core/`). Each object the library touches gets a definition, kept in a `WeakMap`: its events, its properties (value, getter, setter, bindings) and an id. Nothing is stored on the object itself. The tables have no prototype, so a key such as `__proto__` is a key like any other.
- **Properties** (`src/_core/defineprop.ts`, `src/set.ts`). A watched property becomes an accessor. Assigning it (or calling `set`) stores the value and fires `change:KEY`, along with the internal events bindings and `calc` listen to. A setter the user's class defines is kept.
- **Events** (`src/on/`, `src/off/`, `src/trigger/`). Object events and DOM events (`click::KEY`) share one API. A path (`a.b@change:c`) delegates a listener to a nested object; when a branch is replaced, the listeners move to the new branch.
- **Bindings** (`src/bindnode/`, `src/binders/`). `bindNode` ties a property to nodes. A binder says how: which DOM event to listen to, how to read the node (`getValue`) and how to write it (`setValue`). Default binders cover form fields and output elements; `Matreshka.binders` has the rest (`text`, `html`, `attr`, `className`, `display`, …). `parseBindings` turns `{{key}}` in markup into text bindings.
- **Computed values** (`src/calc/`). `calc` sets a property from other properties, nested ones included, and updates it when they change.
- **Collections** (`src/object/`, `src/array/`). `Matreshka.Object` tracks a set of data keys. `Matreshka.Array` has the native array methods, keeps its items as instances of its `Model`, and renders them into the bound container with `itemRenderer`: on change it diffs the items and moves, adds or removes nodes (`trackBy` keeps them by id).
- **Router and form parser** (`src/router/`, `src/parse-form/`). The router binds properties to the parts of the URL: the hash by default, or the History API path. `parseForm` binds a form's fields by their names.
- **DOM layer** (`src/_dom/`). A small selector, HTML-parsing and delegated-event helper, so there is no DOM library dependency.

## Builds

`npm run build` compiles `src/` with TypeScript, then Babel to ES5 for IE 11, into `dist/` (ES modules with type declarations). Rollup bundles the entry points into `dist/matreshka.js` and `dist/matreshka.min.js` for a script tag, and `dist/matreshka.min.mjs`, one ES module for a CDN, built from the code before Babel. The build is repeatable: building the same commit twice gives the same files, and the packed tarball matches the published one.
