# Matreshka.js [![npm version](https://img.shields.io/npm/v/matreshka.svg)](https://www.npmjs.com/package/matreshka) [![CI](https://github.com/finom/matreshka/actions/workflows/ci.yml/badge.svg)](https://github.com/finom/matreshka/actions/workflows/ci.yml) [![Coverage](https://img.shields.io/endpoint?url=https%3A%2F%2Fmatreshka.js.org%2Fbadges%2Fcoverage.json)](https://github.com/finom/matreshka/actions/workflows/docs.yml) [![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/finom/matreshka/badge)](https://scorecard.dev/viewer/?uri=github.com/finom/matreshka)

<a href="https://matreshka.js.org">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://matreshka.js.org/logo/matreshka-full-horizontal-dark.svg">
    <img alt="Matreshka.js" src="https://matreshka.js.org/logo/matreshka-full-horizontal.svg" height="100">
  </picture>
</a>

Reactive data binding for the HTML you already have. Matreshka binds the properties of plain JavaScript objects to DOM nodes: change a property and the node updates; type into the node and the property updates. Computed values, lists rendered from data and events build on that. It works from one `<script>` tag without a build, and from npm as an ES module with TypeScript types.

## Why it exists

For pages whose HTML already exists: server-rendered apps, widgets, old code, a single HTML file. Add one `<script>` tag, bind object properties to elements in JavaScript, keep the markup as it is. Since 2013; 3.0 is one package with ES modules and TypeScript types.

## Use it

With a script tag:

```html
<input class="name">
<p>Hello, <span class="greeting"></span>!</p>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
  const { bindNode, calc, binders } = Matreshka;
  const page = {};

  bindNode(page, 'name', '.name');
  calc(page, 'greeting', 'name', (name) => name || 'stranger');
  bindNode(page, 'greeting', '.greeting', binders.text());
</script>
```

From npm:

```sh
npm install matreshka
```

```js
import { bindNode, calc, binders } from 'matreshka';
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

The classes are there for larger pieces: `Matreshka`, `MatreshkaObject` for data with known keys, and `MatreshkaArray`, which renders one node per item and keeps the DOM in sync with the array.

```js
import Matreshka from 'matreshka';

class Application extends Matreshka {
  constructor() {
    super();
    this.bindNode('x', '.my-input');
    this.bindNode('x', '.my-output', Matreshka.binders.text());
  }
}
```

## For AI coding agents

Add the Matreshka skill to Claude Code, Cursor, Codex and other agents:

```sh
npx skills add finom/matreshka
```

## Resources

- [Documentation](https://matreshka.js.org), in [English](https://matreshka.js.org), [Ukrainian](https://matreshka.js.org/ua/) and [Russian](https://matreshka.js.org/ru/)
- [Examples](https://matreshka.js.org/#examples): a signup form, a product table, a widget on someone else's page, TodoMVC and more
- [Changelog](https://github.com/finom/matreshka/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/finom/matreshka/blob/main/CONTRIBUTING.md)

**License:** [MIT](https://github.com/finom/matreshka/blob/main/LICENSE)
