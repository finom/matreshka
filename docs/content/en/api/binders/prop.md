---
title: "Matreshka.binders.prop"
sidebarTitle: "prop"
description: "Matreshka.binders.prop: Returns a binder which changes given property of DOM node depending on an object property value"
importance: 2
---

# Matreshka.binders.prop

**Method** · Since 0.3

**Import:**

```js
import { binders } from 'matreshka';

const { prop } = binders;
```

```js
Matreshka.binders.prop(property, [mappingFn]) → binder
```

Returns a binder which changes given property of DOM node depending on an object property value

The property value can be transformed using ``mappingFn`` argument.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `property` | [`string`](/api/types/string/) | A property name |
| `mappingFn` (optional) | [`function`](/api/types/function/) | Mapping function |

## Examples

```js
this.bindNode('disabled', '.my-button',
        Matreshka.binders.prop('disabled'));

// sets disabled = true property for the node
this.disabled = true;

// sets disabled = false property for the node
this.disabled = false;
```

**The usage of mapping function**

```js
this.bindNode('myProp', '.my-node',
    Matreshka.binders.prop('foo', value => `Hello, ${value}`));

// foo property of the element now has value "Hello, World"
this.myProp = 'World';
```
