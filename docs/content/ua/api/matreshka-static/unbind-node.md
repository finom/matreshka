---
title: "Matreshka.unbindNode"
sidebarTitle: "unbindNode"
description: "Matreshka.unbindNode: Розриває зв'язок між властивістю і HTML елементом"
importance: 3
---

# Matreshka.unbindNode

**Метод**

**Імпорт:**

```js
import { unbindNode } from 'matreshka';
```

```js
Matreshka.unbindNode() → object
```

Розриває зв'язок між властивістю і HTML елементом

Цей статичний метод працює так само, як і [`Matreshka#unbindNode`](/ua/api/matreshka/unbind-node/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#unbindNode`](/ua/api/matreshka/unbind-node/)

## Приклади

```js
const object = {};
Matreshka.unbindNode(object, 'x', '.my-node');
```
