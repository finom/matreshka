---
title: "Matreshka.bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka.bindOptionalNode: Пов'язує елемент із властивістю, але не кидає виняток, якщо аргумент node - порожній масив, undefined або не існує"
importance: 3
---

# Matreshka.bindOptionalNode

**Метод**

**Імпорт:**

```js
import { bindOptionalNode } from 'matreshka';
```

```js
Matreshka.bindOptionalNode() → object
```

Пов'язує елемент із властивістю, але не кидає виняток, якщо аргумент node - порожній масив, ``undefined`` або не існує

Цей статичний метод працює так само, як і [`Matreshka#bindOptionalNode`](/ua/api/matreshka/bind-optional-node/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#bindOptionalNode`](/ua/api/matreshka/bind-optional-node/)

## Приклади

```js
const object = {};
Matreshka.bindOptionalNode(object, 'x', '.my-node');
```
