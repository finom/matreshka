---
title: "Matreshka.binders.existence"
sidebarTitle: "existence"
description: "Matreshka.binders.existence: Returns a binder which controls an existence of DOM node at DOM tree depending on an object property value"
importance: 2
---

# Matreshka.binders.existence

**Method** · Since 2.3

**Import:**

```js
import { binders } from 'matreshka';
// binders.existence === Matreshka.binders.existence
```

```js
Matreshka.binders.existence([bool=true]) → binder
```

Returns a binder which controls an existence of DOM node at DOM tree depending on an object property value

The binder works the same way as [`Matreshka.binders.display`](/api/binders/display/), but instead of visibility change the existence at page DOM is changed. The binder is useful for:

- Big appications: show one or another page depending on route state;
- For infinite scrolling;
- For other cases where you need to hide an element but its existence at DOM tree isn't necessary.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `bool` (optional) | `true` | [`boolean`](/api/types/boolean/) | If the argument equals ``true``, a node is removed when a property value is falsy; if it equals ``false``, it is removed when a property value is truly |

## Examples

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(true));
```

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(false));
```
