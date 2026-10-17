---
title: "Matreshka.instantiate"
sidebarTitle: "instantiate"
description: "Matreshka.instantiate: Creates fixed class instance. Matreshka.js API reference"
importance: 3
---

# Matreshka.instantiate

**Method**

**Import:**

```js
import { instantiate } from 'matreshka';
```

```js
Matreshka.instantiate() → object
```

Creates fixed class instance

This static method works the same as [`Matreshka#instantiate`](/api/matreshka/instantiate/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#instantiate`](/api/matreshka/instantiate/)

## Examples

```js
const object = {};
Matreshka.instantiate(object, 'x', SomeClass);
object.x = { a: 42 };
alert(object.x instanceof SomeClass); // true
alert(object.x.a); // 42
```
