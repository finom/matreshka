---
title: "Matreshka.binders.output"
sidebarTitle: "output"
description: "Matreshka.binders.output: Returns a binder which binds an object property to an output element value. It is not obligatory to use the binder directly because…"
importance: 3
---

# Matreshka.binders.output

**Method** · Since 0.3

**Import:**

```js
import { binders } from 'matreshka';

const { output } = binders;
// or
import { binders } from 'matreshka';

const { output } = binders;
```

```js
Matreshka.binders.output() → binder
```

Returns a binder which binds an object property to an ``output`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.

``undefined`` and ``null`` show as an empty string.

**Returns:** [`binder`](/api/types/binder/)

## Examples

```js
this.bindNode('myKey', '.my-output', Matreshka.binders.output());
```
