---
title: "Matreshka.bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka.bindOptionalNode: Initializes two-way data binding but does not throws an exception if node argument is an empty array, undefined or non-existent"
importance: 3
---

# Matreshka.bindOptionalNode

**Method** · Since 1.1

**Import:**

```js
import { bindOptionalNode } from 'matreshka';
```

```js
Matreshka.bindOptionalNode() → object
```

Initializes two-way data binding but does not throws an exception if ``node`` argument is an empty array, ``undefined`` or non-existent

This static method works the same as [`Matreshka#bindOptionalNode`](/api/matreshka/bind-optional-node/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#bindOptionalNode`](/api/matreshka/bind-optional-node/)

## Examples

```js
const object = {};
Matreshka.bindOptionalNode(object, 'x', '.my-node');
```
