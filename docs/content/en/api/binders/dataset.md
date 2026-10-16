---
title: "Matreshka.binders.dataset"
sidebarTitle: "dataset"
description: "Matreshka.binders.dataset: Returns a binder which changes given dataset property of bound DOM node depending on an object property value."
importance: 2
---

# Matreshka.binders.dataset

**Method** · Since 1.1

**Import:**

```js
import dataset from 'matreshka/binders/dataset';
// or
import { dataset } from 'matreshka/binders';
```

```js
Matreshka.binders.dataset(property, [mappingFn]) → binder
```

Returns a binder which changes given [dataset](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset) property of bound DOM node depending on an object property value.

The property value can be transformed using ``mappingFn`` argument.

``undefined`` and ``null`` show as an empty string.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `property` | [`string`](/api/types/string/) | A property of ``dataset`` object |
| `mappingFn` (optional) | [`function`](/api/types/function/) | Mapping function |

## Examples

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.dataset('myProp'));
this.myKey = 'foo';
```

**The usage of mapping function**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.dataset('myProp', value => `Hello, ${value}`));

this.myKey = 'foo'; // the attr data-my-prop now has value "Hello, foo"
```
