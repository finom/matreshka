---
title: "Matreshka#selectAll"
sidebarTitle: "selectAll"
description: "Matreshka#selectAll: Returns HTML nodes corresponding to a selector from a sandbox"
importance: 2
---

# Matreshka#selectAll

**Method**

```js
Matreshka#selectAll(selector) → $nodes
```

Returns HTML nodes corresponding to a selector from a sandbox

Synonym: `Matreshka#$`

The result is a plain array of nodes, empty when nothing matches.

After sandbox declaration using [`Matreshka#bindNode`](/api/matreshka/bind-node/) method, you can get its descendants. Besides, the method supports the ``:bound(KEY)`` selector.

> The method has [static alternative](/api/matreshka-static/select-all/)

**Returns:** [`$nodes`](/api/types/dollar-nodes/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `selector` | [`string`](/api/types/string/) | A selector |

## Examples

```js
this.bindNode('sandbox', '.app');
nodes = this.selectAll('.my-element');
// the same as
nodes = this.$('.my-element'); // $ is a short reference to selectAll
// the same as
nodes = [...document.querySelector('.app').querySelectorAll('.my-element')];
```

**The ``:bound(KEY)`` selector**

```js
this.bindNode('myKey', '.my-element');
nodes = this.selectAll(':bound(myKey) .my-another-element');
// the same as
nodes = [...document.querySelector('.my-element').querySelectorAll('.my-another-element')];
```
