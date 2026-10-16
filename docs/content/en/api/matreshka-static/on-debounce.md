---
title: "Matreshka.onDebounce"
sidebarTitle: "onDebounce"
description: "Matreshka.onDebounce: Adds an event handler which is called only once during a definite period of time"
importance: 3
---

# Matreshka.onDebounce

**Method** · Since 1.1

**Import:**

```js
import onDebounce from 'matreshka/ondebounce';
```

```js
Matreshka.onDebounce() → object
```

Adds an event handler which is called only once during a definite period of time

This static method works the same as [`Matreshka#onDebounce`](/api/matreshka/on-debounce/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#onDebounce`](/api/matreshka/on-debounce/)

## Examples

```js
const object = {};
Matreshka.onDebounce(object, 'foo', evt => {
	//...
});
```
