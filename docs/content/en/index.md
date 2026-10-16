---
title: "Data binding for the HTML you already have | Matreshka.js"
sidebarTitle: "Home"
description: "Matreshka.js binds plain JavaScript objects to the HTML already on the page: two-way binding, computed values, lists. One script tag, or npm with types."
---

# Matreshka.js

Type into the field: the property `x` is bound to both nodes.

```html
<input class="in" type="text">
<output class="out"></output>

<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
<script>
const { bindNode } = Matreshka;
const app = {};
bindNode(app, 'x', '.in, .out');
app.x = 'Data binding for the HTML you already have';
</script>
```

## Why Matreshka

For pages whose HTML already exists: server-rendered apps, widgets, old code, a single HTML file. Add one `<script>` tag, bind object properties to nodes in JavaScript, keep the markup as it is. Since 2013; 3.0 is one package with ES modules and TypeScript types.

Read the [introduction](/introduction/) or the [API reference](/api/matreshka/).

## Install

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
```

```sh
npm install matreshka
```

```js
import { bindNode, calc, binders } from 'matreshka';
```

For AI coding agents (Claude Code, Cursor, Codex and others), add the Matreshka skill:

```sh
npx skills add finom/matreshka
```

The documentation is also available [in Ukrainian](/ua/) and [in Russian](/ru/).
