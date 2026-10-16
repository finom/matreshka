---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: An object contains collections (jQuery, Zepto, built-in micro-library instance inherited from Array.prototype) of bound nodes for quick…"
importance: 3
---

# Matreshka#$nodes

**Property** · Since 1.1

```js
Matreshka#$nodes: $nodes
```

An object contains collections (jQuery, Zepto, built-in micro-library instance inherited from ``Array.prototype``) of bound nodes for quick access.

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // the same as $('.my-node')
```
