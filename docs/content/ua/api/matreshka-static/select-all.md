---
title: "Matreshka.selectAll"
sidebarTitle: "selectAll"
description: "Matreshka.selectAll: Повертає елементи з пісочниці, відповідні селектору"
importance: 3
---

# Matreshka.selectAll

**Метод**

**Імпорт:**

```js
import { selectAll } from 'matreshka';
```

```js
Matreshka.selectAll() → $nodes
```

Повертає елементи з пісочниці, відповідні селектору

Цей статичний метод працює так само, як і [`Matreshka#selectAll`](/ua/api/matreshka/select-all/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`$nodes`](/ua/api/types/dollar-nodes/) – найденные элементы

## Посилання

- [`Matreshka#selectAll`](/ua/api/matreshka/select-all/)

## Приклади

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.selectAll(object, '.my-element');
```
