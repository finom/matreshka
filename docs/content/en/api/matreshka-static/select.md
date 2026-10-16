---
title: "Matreshka.select"
sidebarTitle: "select"
description: "Matreshka.select: Returns HTML node corresponding to a selector from a sandbox"
importance: 3
---

# Matreshka.select

**Method**

**Import:**

```js
import { select } from 'matreshka';
```

```js
Matreshka.select() → node|null
```

Returns HTML node corresponding to a selector from a sandbox

This static method works the same as [`Matreshka#select`](/api/matreshka/select/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`node`](/api/types/node/) \| [`null`](/api/types/null/)

## Links

- [`Matreshka#select`](/api/matreshka/select/)

## Examples

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.select(object, '.my-element');
```
