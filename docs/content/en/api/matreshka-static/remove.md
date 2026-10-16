---
title: "Matreshka.remove"
sidebarTitle: "remove"
description: "Matreshka.remove: Deletes a property. Matreshka.js API reference"
importance: 3
---

# Matreshka.remove

**Method** · Since 1.1

**Import:**

```js
import { remove } from 'matreshka';
```

```js
Matreshka.remove() → object
```

Deletes a property

This static method works the same as [`Matreshka#remove`](/api/matreshka/remove/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#remove`](/api/matreshka/remove/)

## Examples

```js
Matreshka.remove(object, 'x');
```
