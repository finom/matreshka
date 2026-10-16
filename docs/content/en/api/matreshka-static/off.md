---
title: "Matreshka.off"
sidebarTitle: "off"
description: "Matreshka.off: Deletes an event handler. Matreshka.js API reference"
importance: 3
---

# Matreshka.off

**Method** · Since 1.1

**Import:**

```js
import { off } from 'matreshka';
```

```js
Matreshka.off() → object
```

Deletes an event handler

This static method works the same as [`Matreshka#off`](/api/matreshka/off/) and all its variations, but accepts any kind of JavaScript object as first argument.

Called with the object only, it removes every handler added with ``on``, ``once`` and ``onDebounce``; bindings and ``calc`` dependencies stay.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#off`](/api/matreshka/off/)

## Examples

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	//...
});

Matreshka.off(object, 'foo');
```
