---
title: "Matreshka.bindNode"
sidebarTitle: "bindNode"
description: "Matreshka.bindNode: Binds a property of an object to HTML node, implementing two-way data binding"
importance: 1
---

# Matreshka.bindNode

**Method** · Since 1.1

**Import:**

```js
import { bindNode } from 'matreshka';
```

```js
Matreshka.bindNode() → object
```

Binds a property of an object to HTML node, implementing two-way data binding

This static method works the same as [`Matreshka#bindNode`](/api/matreshka/bind-node/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
const object = {};
Matreshka.bindNode(object, 'x', '.my-node');
```
