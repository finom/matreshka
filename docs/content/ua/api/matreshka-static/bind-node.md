---
title: "Matreshka.bindNode"
sidebarTitle: "bindNode"
description: "Matreshka.bindNode: Пов'язує властивість об'єкта з HTML елементом"
importance: 1
---

# Matreshka.bindNode

**Метод**

**Імпорт:**

```js
import { bindNode } from 'matreshka';
```

```js
Matreshka.bindNode() → object
```

Пов'язує властивість об'єкта з HTML елементом

Цей статичний метод працює так само, як і [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
const object = {};
Matreshka.bindNode(object, 'x', '.my-node');
```
