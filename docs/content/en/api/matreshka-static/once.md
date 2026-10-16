---
title: "Matreshka.once"
sidebarTitle: "once"
description: "Matreshka.once: Adds event handler which can be called only once"
importance: 3
---

# Matreshka.once

**Method**

**Import:**

```js
import { once } from 'matreshka';
```

```js
Matreshka.once() → object
```

Adds event handler which can be called only once

This static method works the same as [`Matreshka#once`](/api/matreshka/once/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#once`](/api/matreshka/once/)

## Examples

```js
const object = {};
Matreshka.once(object, 'foo', evt => {
	//...
});
```
