---
title: "Matreshka#bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka#bindOptionalNode: Works just the same as Matreshka#bindNode but it does not throw an exception if the node argument is an empty array, undefined or…"
importance: 2
---

# Matreshka#bindOptionalNode

**Method**

```js
Matreshka#bindOptionalNode()
```

Works just the same as [`Matreshka#bindNode`](/api/matreshka/bind-node/) but it does not throw an exception if the ``node`` argument is an empty array, ``undefined`` or non-existent.

> The method has [static alternative](/api/matreshka-static/bind-optional-node/)

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
this.bindOptionalNode('myKey', '.my-element');
```
