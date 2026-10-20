---
title: "Matreshka.binders.progress"
sidebarTitle: "progress"
description: "Matreshka.binders.progress: Returns a binder which binds an object property to a progress element value. It is not obligatory to use the binder directly…"
importance: 3
---

# Matreshka.binders.progress

**Method**

**Import:**

```js
import { binders } from 'matreshka';

const { progress } = binders;
```

```js
Matreshka.binders.progress() → binder
```

Returns a binder which binds an object property to a ``progress`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.

**Returns:** [`binder`](/api/types/binder/)

## Examples

```js
this.bindNode('myKey', '.my-progress', Matreshka.binders.progress());
```
