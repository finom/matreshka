---
title: "Matreshka.binders.html"
sidebarTitle: "html"
description: "Matreshka.binders.html: Returns a binder which changes innerHTML of bound DOM node depending on an object property value"
importance: 2
---

# Matreshka.binders.html

**Method** · Since 0.1

**Import:**

```js
import { binders } from 'matreshka';
// binders.html === Matreshka.binders.html
```

```js
Matreshka.binders.html([mappingFn]) → binder
```

Returns a binder which changes ``innerHTML`` of bound DOM node depending on an object property value

The property value can be transformed using ``mappingFn`` argument.

``undefined`` and ``null`` show as an empty string.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `mappingFn` (optional) | [`function`](/api/types/function/) | Mapping function |

## Examples

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.html());
// sets innerHTML="<div>foo</div>"
this.myKey = '<div>foo</div>';
```

**The usage of mapping function**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.html(value => `Hello, ${value}`));

// sets innerHTML="Hello, <div>foo</div>"
this.myKey = '<div>foo</div>';
```
