---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: An object with an array of the bound nodes for each property, for quick access."
importance: 3
---

# Matreshka#$nodes

**Property** · Since 1.1

```js
Matreshka#$nodes: $nodes
```

An object with an array of the bound nodes for each property, for quick access.

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // an array: the same nodes as [...document.querySelectorAll('.my-node')]
```
