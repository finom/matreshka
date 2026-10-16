---
title: "Matreshka.trigger"
sidebarTitle: "trigger"
description: "Matreshka.trigger: Fires an event. Matreshka.js API reference"
importance: 3
---

# Matreshka.trigger

**Method** · Since 1.1

**Import:**

```js
import { trigger } from 'matreshka';
```

```js
Matreshka.trigger() → object
```

Fires an event

This static method works the same as [`Matreshka#trigger`](/api/matreshka/trigger/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#trigger`](/api/matreshka/trigger/)

## Examples

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	alert(evt.hello);
});

Matreshka.trigger(object, 'foo', { hello: 'World' });
```
