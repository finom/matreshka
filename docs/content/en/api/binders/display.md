---
title: "Matreshka.binders.display"
sidebarTitle: "display"
description: "Matreshka.binders.display: Returns a binder which controls a visibility of DOM node (using style.display) depending on an object property value"
importance: 2
---

# Matreshka.binders.display

**Method** · Since 0.1

**Import:**

```js
import { binders } from 'matreshka';

const { display } = binders;
```

```js
Matreshka.binders.display([bool=true]) → binder
```

Returns a binder which controls a visibility of DOM node (using ``style.display``) depending on an object property value

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `bool` (optional) | `true` | [`boolean`](/api/types/boolean/) | If the argument equals ``true``, a node is hidden when a property value is falsy; if it equals ``false``, it is hidden when a property value is truly. |

## Examples

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.display(true));
```

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.display(false));
```
