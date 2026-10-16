---
title: "Matreshka#nodes"
sidebarTitle: "nodes"
description: "Matreshka#nodes: The object contains bound elements in the form of separate DOM nodes for quick access"
importance: 3
---

# Matreshka#nodes

**Property** · Since 1.1

```js
Matreshka#nodes: node
```

The object contains bound elements in the form of separate DOM nodes for quick access

Pay attention, every object property has got the first node of the bound ones to the corresponding property. Use [`Matreshka#$nodes`](/api/matreshka/dollar-nodes/) for getting all the nodes bound to a certain property.

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)

## Examples

```js
this.bindNode('myKey', '.my-node');
this.nodes.myKey; // the same as $('.my-node')[0]
```
