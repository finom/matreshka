---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: An object contains arrays of bound nodes for quick access."
importance: 3
---

# Matreshka#$nodes

**Property**

```js
Matreshka#$nodes: $nodes
```

An object contains arrays of bound nodes for quick access.

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // an array of the nodes, like Array.from(document.querySelectorAll('.my-node'))
```
