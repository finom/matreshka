---
title: "Matreshka.toMatreshka"
sidebarTitle: "toMatreshka"
description: "Matreshka.toMatreshka: The function, converting any nested tree of objects and arrays into Matreshka.Object and Matreshka.Array instances"
importance: 3
---

# Matreshka.toMatreshka

**Method** · Since 1.1

**Import:**

```js
import { toMatreshka } from 'matreshka';
```

```js
Matreshka.toMatreshka() → matreshka
```

The function, converting any nested tree of objects and arrays into [`Matreshka.Object`](/api/matreshka-object/) and [`Matreshka.Array`](/api/matreshka-array/) instances

Only arrays and ``Matreshka.Array`` instances become ``Matreshka.Array``; every other object, even one with a ``length`` property, becomes ``Matreshka.Object``. A ``Matreshka.Object`` passed in gives only its data keys.

**Returns:** [`matreshka`](/api/types/matreshka/) – a newly created instance of ``Matreshka``

## Examples

```js
const matreshka = Matreshka.toMatreshka({
	a: 1,
	b: {
		c: 2
	},
	d: [{e: 1}, {e: 2}, {e: 3}]
});
```
