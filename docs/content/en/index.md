---
title: "Two-way data binding JavaScript framework | Matreshka.js"
description: "Matreshka.js is a JavaScript framework with two-way data binding for the HTML you already have: one script tag, no build step, zero dependencies."
sidebarTitle: "Home"
---

# Matreshka.js

```html
<input class="in" type="text">
<output class="out"></output>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const app = new Matreshka();
app.bindNode('x', '.in, .out');
app.x = 'A framework for single-page applications creation';
</script>
```

## Why Matreshka

For pages whose HTML already exists: server-rendered apps, widgets, old code, a single HTML file. Add one `<script>` tag, bind object properties to nodes in JavaScript, keep the markup as it is. Since 2013; 3.0 is one package with ES modules and TypeScript types, and zero dependencies.

**Size:** `matreshka.min.js` is %size-min% kB minified, %size-gzip% kB with gzip and %size-brotli% kB with brotli, the compression a CDN uses for current browsers.

## Features

- Reactive API which allows to solve hard and confusing problems easily
- High robustness of developed apps
- The ability to refactor legacy applications without rewriting them from scratch
- Only couple of hours is needed to master the framework because of an absence of complex concepts

Read more in the [introduction](/introduction/), or go straight to the [API reference](/api/).

## Install

```sh
npm install matreshka
```

```js
import Matreshka from 'matreshka';
```

For AI coding agents (Claude Code, Cursor, Codex and others), add the Matreshka skill:

```sh
npx skills add finom/matreshka
```

To give an LLM the whole documentation in one file, copy [llms-full.txt](/llms-full.txt) into the chat.

The documentation is also available [in Ukrainian](/ua/) and [in Russian](/ru/).
