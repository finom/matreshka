---
title: "Matreshka.set"
sidebarTitle: "set"
description: "Matreshka.set: Sets a property value allowing to pass an event object as the third argument"
importance: 3
---

# Matreshka.set

**Method** · Since 1.1

**Import:**

```js
import { set } from 'matreshka';
```

```js
Matreshka.set() → object
```

Sets a property value allowing to pass an event object as the third argument

This static method works the same as [`Matreshka#set`](/api/matreshka/set/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#set`](/api/matreshka/set/)

## Examples

```js
const object = {};
Matreshka.set(object, 'x', 42, {
	someOption: true
});
```
