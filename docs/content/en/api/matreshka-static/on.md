---
title: "Matreshka.on"
sidebarTitle: "on"
description: "Matreshka.on: Adds an event handler. Matreshka.js API reference"
importance: 1
---

# Matreshka.on

**Method** · Since 1.1

**Import:**

```js
import on from 'matreshka/on';
```

```js
Matreshka.on() → object
```

Adds an event handler

This static method works the same as [`Matreshka#on`](/api/matreshka/on/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#on`](/api/matreshka/on/)

## Examples

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	alert(evt.hello);
});

Matreshka.trigger(object, 'foo', { hello: 'World' });
```
