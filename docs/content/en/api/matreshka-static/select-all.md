---
title: "Matreshka.selectAll"
sidebarTitle: "selectAll"
description: "Matreshka.selectAll: Returns HTML nodes corresponding to a selector from a sandbox"
importance: 3
---

# Matreshka.selectAll

**Method** · Since 1.1

**Import:**

```js
import { selectAll } from 'matreshka';
```

```js
Matreshka.selectAll() → $nodes
```

Returns HTML nodes corresponding to a selector from a sandbox

This static method works the same as [`Matreshka#selectAll`](/api/matreshka/select-all/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`$nodes`](/api/types/dollar-nodes/)

## Links

- [`Matreshka#selectAll`](/api/matreshka/select-all/)

## Examples

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.selectAll(object, '.my-element');
```
