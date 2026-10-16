---
title: "Getting started"
description: "Install Matreshka.js from npm or a CDN, import the whole framework or single modules, and find your way through the three importance levels of the API."
---

# Getting started

## Installation

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
// or, with CommonJS (Node.js 22.12+)
const { Matreshka } = require('matreshka');
```

The router and the form parser are in the same package: `matreshka/router` binds properties to parts of the URL, `matreshka/parse-form` binds named form fields to properties.

`initRouter(object, '/a/b/')` keeps `object.a` and `object.b` in sync with the parts of `location.hash` after `#!` (`#!/foo/bar/`); the values are encoded in the URL and decoded in the properties. Pass `'history'` as the third argument to use the path through the History API instead. `parseForm(object, form)` returns the form, or `null` when the form isn't found.

```js
import { initRouter } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';
```

### A script tag

Without a bundler, load the browser bundle. It defines the global `Matreshka`, with the router and the form parser on it: `Matreshka.initRouter`, `Matreshka.Router` and `Matreshka.parseForm`. The bundle targets current browsers.

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

This site serves the same file: [/matreshka.min.js](/matreshka.min.js).

## Modules

Every static function or class is a named export of the main module.

```js
import { MatreshkaArray, bindNode, binders } from 'matreshka';

const { prop } = binders;
```

## Importance levels

The API is split up into three parts.

### The first level: the most important stuff

After you've learned the most important API parts you can hardily start doing fantastic things. Start with [`Matreshka#bindNode`](/api/matreshka/bind-node/), [`Matreshka#calc`](/api/matreshka/calc/), [`Matreshka#on`](/api/matreshka/on/), [`Matreshka.Object`](/api/matreshka-object/) and [`Matreshka.Array`](/api/matreshka-array/).

### The second level: recommended to learn

If you already know the quick-start basics, you can look at less important (but still important) methods and properties of the framework.

### The third level: other methods and properties

Rarely used members are marked "Advanced" and listed last in each section of the sidebar. Read them when you want to know everything about Matreshka.js.

Next: [Hello World and other examples](/examples/).
