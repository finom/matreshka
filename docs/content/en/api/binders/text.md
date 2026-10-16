---
title: "Matreshka.binders.text"
sidebarTitle: "text"
description: "Matreshka.binders.text: Returns a binder which changes textContent of bound DOM node depending on an object property value"
importance: 2
---

# Matreshka.binders.text

**Method** · Since 1.1

**Import:**

```js
import { binders } from 'matreshka';
// binders.text === Matreshka.binders.text
```

```js
Matreshka.binders.text([mappingFn]) → binder
```

Returns a binder which changes ``textContent`` of bound DOM node depending on an object property value

The property value can be transformed using ``mappingFn`` argument.

``undefined`` and ``null`` show as an empty string.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `mappingFn` (optional) | [`function`](/api/types/function/) | Mapping function |

## Examples

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.text());
this.myKey = 'foo'; // sets textContent as "foo"
```

**The usage of mapping function**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.text(value => `Hello, ${value}`));

this.myKey = 'foo'; // sets textContent as "Hello, foo"
```
