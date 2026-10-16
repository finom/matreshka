---
title: "Matreshka.select"
sidebarTitle: "select"
description: "Matreshka.select: Повертає елемент з пісочниці, відповідний селектору"
importance: 3
---

# Matreshka.select

**Метод**

**Імпорт:**

```js
import { select } from 'matreshka';
```

```js
Matreshka.select() → node|null
```

Повертає елемент з пісочниці, відповідний селектору

Цей статичний метод працює так само, як і [`Matreshka#select`](/ua/api/matreshka/select/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`node`](/ua/api/types/node/) \| [`null`](/ua/api/types/null/) – знайдений елемент

## Посилання

- [`Matreshka#select`](/ua/api/matreshka/select/)

## Приклади

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.select(object, '.my-element');
```
