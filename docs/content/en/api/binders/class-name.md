---
title: "Matreshka.binders.className"
sidebarTitle: "className"
description: "Matreshka.binders.className: Returns a binder which switches over DOM node class name depending on an object property value. If property value equals true…"
importance: 2
---

# Matreshka.binders.className

**Method** · Since 0.1

**Import:**

```js
import { binders } from 'matreshka';
// binders.className === Matreshka.binders.className
```

```js
Matreshka.binders.className(className, [bool=true]) → binder
```

Returns a binder which switches over DOM node class name depending on an object property value. If property value equals ``true`` non-strictly, a class name is added, otherwise - it's removed. The logic can be changed by passing ``false`` as the second argument and in this way, a class name will be added  when a property value equals ``false`` non-strictly and vice versa.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `className` |  | [`string`](/api/types/string/) |  |
| `bool` (optional) | `true` | [`boolean`](/api/types/boolean/) |  |

## Examples

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('foo'));

this.myKey = true; // adds the 'foo' class

this.myKey = false; // removes the 'foo' class
```

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('foo', false));

this.myKey = false; // adds the 'foo' class

this.myKey = true; // removes the 'foo' class
```
