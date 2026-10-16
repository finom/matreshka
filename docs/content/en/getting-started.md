---
title: "Getting started"
description: "Load Matreshka.js with a script tag, as a CDN ES module or from npm, write the first bindings on a plain object, and upgrade from 2.x."
---

# Getting started

## Installation

### A script tag

No build step. The bundle defines one global, `Matreshka`, with the router and the form parser in it. It targets current browsers.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
  const { bindNode, calc, binders } = Matreshka;
</script>
```

This site serves the same file at [/matreshka.min.js](/matreshka.min.js).

### A CDN ES module

```html
<script type="module">
  import Matreshka, { bindNode, calc } from 'https://cdn.jsdelivr.net/npm/matreshka@3/+esm';
</script>
```

### npm

```sh
npm install matreshka
```

```js
import Matreshka, { bindNode, calc, on, mediate, binders, MatreshkaObject, MatreshkaArray } from 'matreshka';
```

Every static function of `Matreshka` is a named export, and so are the classes and `binders`. Each page of the API reference shows its import. The package is ES modules only and includes TypeScript types.

Node.js 22.12 and later can also load it with `require`, which gives the exports object:

```js
const { Matreshka, bindNode } = require('matreshka');
```

## A first example

```html
<input class="name">
<p>Hello, <span class="greeting"></span>!</p>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
  const { bindNode, calc, binders } = Matreshka;
  const page = {};

  // page.name follows the field, and the field follows page.name
  bindNode(page, 'name', '.name');

  // page.greeting is recomputed when page.name changes
  calc(page, 'greeting', 'name', (name) => name || 'stranger');

  // the span shows page.greeting as text
  bindNode(page, 'greeting', '.greeting', binders.text());
</script>
```

`page` is a plain object. Type into the field, or run `page.name = 'Ann'` in the console: the field and the greeting update.

The [`Matreshka`](/api/matreshka/) class has the same functions as methods. The same page as a class:

```js
import Matreshka from 'matreshka';

class Page extends Matreshka {
  constructor() {
    super();
    this.bindNode('name', '.name');
    this.calc('greeting', 'name', (name) => name || 'stranger');
    this.bindNode('greeting', '.greeting', Matreshka.binders.text());
  }
}

const page = new Page();
```

## The router and the form parser

```js
import { initRouter, Router } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

The script-tag bundle has them as `Matreshka.initRouter`, `Matreshka.Router` and `Matreshka.parseForm`.

`initRouter(object, '/a/b/')` keeps `object.a` and `object.b` in sync with the parts of `location.hash` after `#!` (`#!/foo/bar/`); the values are encoded in the URL and decoded in the properties. Pass `'history'` as the third argument to use the path through the History API instead. `parseForm(object, form)` binds the named fields of a form to properties of the object and returns the form, or `null` when the form isn't found.

See the [router demo](/examples/router/#!/foo/bar/baz/) and the [form parser demo](/examples/parse-form/).

## Upgrading from 2.x

- **One package.** The router and the form parser are in it (above). The packages `matreshka-router` and `matreshka-parse-form` are retired.
- **Named exports instead of deep imports.** The deep paths of 2.x (`matreshka/bindnode`, `matreshka/array/from`, `matreshka/binders/html`) are gone. Import from `'matreshka'` instead: `import { bindNode } from 'matreshka'`. A binder becomes `binders.html`, with `import { binders } from 'matreshka'`, or `Matreshka.binders.html`.
- **ES modules only**, with TypeScript types. `require('matreshka')` works on Node.js 22.12 and later and gives the exports object.
- **One script-tag bundle** with the router and the form parser in it. The `MK` global alias is gone: use `Matreshka`.
- **No DOM library.** The 2.x method that chose a DOM library is removed, and Matreshka no longer uses a global jQuery or Zepto. [`bindNode`](/api/matreshka/bind-node/) still accepts a jQuery object, or anything array-like, as nodes.
- **Plain arrays of nodes.** [`$nodes`](/api/matreshka/dollar-nodes/), [`selectAll`](/api/matreshka/select-all/) and `$` return arrays.
- **`parserBrackets` only.** Its misspelled alias is removed.
- **No write-back into the source node.** A change that comes from a node isn't written back into that node. See [`mediate`](/api/matreshka/mediate/).

## Where to go next

Start with [`bindNode`](/api/matreshka/bind-node/), [`calc`](/api/matreshka/calc/), [`on`](/api/matreshka/on/), [`mediate`](/api/matreshka/mediate/), the [binders](/api/binders/), [`Matreshka.Object`](/api/matreshka-object/) and [`Matreshka.Array`](/api/matreshka-array/). Rarely used members stay hidden until you turn on Advanced mode in the menu; see [how to use this site](/website-instructions/).

Next: [examples](/examples/).
