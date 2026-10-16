---
title: "Matreshka.once"
sidebarTitle: "once"
description: "Matreshka.once: Adds event handler which can be called only once"
importance: 3
---

# Matreshka.once

**Method** · Since 1.1

**Import:**

```js
import once from 'matreshka/once';
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
