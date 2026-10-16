---
title: "Matreshka.mediate"
sidebarTitle: "mediate"
description: "Matreshka.mediate: Transforms property value on its changing"
importance: 1
---

# Matreshka.mediate

**Method** · Since 1.1

**Import:**

```js
import { mediate } from 'matreshka';
```

```js
Matreshka.mediate() → object
```

Transforms property value on its changing

This static method works the same as [`Matreshka#mediate`](/api/matreshka/mediate/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#mediate`](/api/matreshka/mediate/)

## Examples

```js
const object = {};
Matreshka.mediate(object, 'x', String);
object.x = 42;
alert(typeof object.x); // string
```
