---
title: "Matreshka.binders.select"
sidebarTitle: "select"
description: "Matreshka.binders.select: Returns a binder which binds an object property to a select element value. It is not obligatory to use the binder directly because…"
importance: 3
---

# Matreshka.binders.select

**Method** · Since 0.3

**Import:**

```js
import { binders } from 'matreshka';
// binders.select === Matreshka.binders.select
```

```js
Matreshka.binders.select([multiple=false]) → binder
```

Returns a binder which binds an object property to a ``select`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.

``undefined`` and ``null`` select the option without a value, if there is one. With ``multiple`` set to ``true``, the property can be an array of values, a single value or ``null`` (nothing selected); values are compared as strings, so numbers work too.

**Returns:** [`binder`](/api/types/binder/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `multiple` (optional) | `false` | [`boolean`](/api/types/boolean/) | If select is ``multiple`` |

## Examples

```js
this.bindNode('myKey', '.my-select', Matreshka.binders.select(true));
```
