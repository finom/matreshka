---
title: "Matreshka.binders.style"
sidebarTitle: "style"
description: "Matreshka.binders.style: Returns a binder which changes given style property of bound DOM node depending on an object property value"
importance: 2
---

# Matreshka.binders.style

**Method** · Since 1.1

**Import:**

```js
import { binders } from 'matreshka';

const { style } = binders;
```

```js
Matreshka.binders.style(property, [mappingFn]) → binder
```

Returns a binder which changes given style property of bound DOM node depending on an object property value

The property value can be transformed using ``mappingFn`` argument.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `property` | [`string`](/api/types/string/) | A property of ``style`` object (camel-cased) |
| `mappingFn` (optional) | [`function`](/api/types/function/) | Mapping function |

## Examples

```js
this.bindNode('myKey', '.my-progres',
        Matreshka.binders.style('backgroundColor'));
this.myKey = 'red'; // background-color of .my-progress is red now
```

**The usage of mapping function**

```js
this.bindNode('myKey', '.my-element',
  Matreshka.binders.style('backgroundImage', value => `url("${value}")`));

this.myKey = 'cats.jpg'; // backgroundImage now equals to "url("cats.jpg")"
```
