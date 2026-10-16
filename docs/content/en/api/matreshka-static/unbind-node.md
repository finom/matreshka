---
title: "Matreshka.unbindNode"
sidebarTitle: "unbindNode"
description: "Matreshka.unbindNode: Breaks a binding between given property and HTML node"
importance: 3
---

# Matreshka.unbindNode

**Method** · Since 1.1

**Import:**

```js
import unbindNode from 'matreshka/unbindnode';
```

```js
Matreshka.unbindNode() → object
```

Breaks a binding between given property and HTML node

This static method works the same as [`Matreshka#unbindNode`](/api/matreshka/unbind-node/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#unbindNode`](/api/matreshka/unbind-node/)

## Examples

```js
const object = {};
Matreshka.unbindNode(object, 'x', '.my-node');
```
