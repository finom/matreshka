---
title: "Matreshka.bindSandbox"
sidebarTitle: "bindSandbox"
description: "Matreshka.bindSandbox: Binds or re-binds sandbox node"
importance: 3
---

# Matreshka.bindSandbox

**Method** · Since 1.1

**Import:**

```js
import { bindSandbox } from 'matreshka';
```

```js
Matreshka.bindSandbox() → object
```

Binds or re-binds sandbox node

This static method works the same as [`Matreshka#bindSandbox`](/api/matreshka/bind-sandbox/) and all its variations, but accepts any kind of JavaScript object as first argument.

**Returns:** [`object`](/api/types/object/) – The first argument

## Links

- [`Matreshka#bindSandbox`](/api/matreshka/bind-sandbox/)

## Examples

```js
const object = {};
Matreshka.bindSandbox(object, '.my-node');
```
