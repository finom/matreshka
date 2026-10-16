---
title: "Matreshka.parseBindings"
sidebarTitle: "parseBindings"
description: "Matreshka.parseBindings: Parses DOM tree, declaring bindings with properties enclosed in double braces"
importance: 3
---

# Matreshka.parseBindings

**Method** · Since 1.1

**Import:**

```js
import { parseBindings } from 'matreshka';
```

```js
Matreshka.parseBindings() → $nodes
```

Parses DOM tree, declaring bindings with properties enclosed in double braces

This static method works the same as [`Matreshka#parseBindings`](/api/matreshka/parse-bindings/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`$nodes`](/api/types/dollar-nodes/) – Resulting collection of DOM nodes

## Links

- [`Matreshka#parseBindings`](/api/matreshka/parse-bindings/)

## Examples

```js
const object = {};
const $node = Matreshka.parseBindings(object, `
    <h3>Hello, {{name}}</h3>
`);
object.name = 'World';
```
