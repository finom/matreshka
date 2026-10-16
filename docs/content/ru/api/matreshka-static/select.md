---
title: "Matreshka.select"
sidebarTitle: "select"
description: "Matreshka.select: Возвращает элемент из песочницы, соответствующий селектору"
importance: 3
---

# Matreshka.select

**Метод**

**Импорт:**

```js
import { select } from 'matreshka';
```

```js
Matreshka.select() → node|null
```

Возвращает элемент из песочницы, соответствующий селектору

Этот статичный метод работает так же, как и [`Matreshka#select`](/ru/api/matreshka/select/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`node`](/ru/api/types/node/) \| [`null`](/ru/api/types/null/) – найденный элемент

## Ссылки

- [`Matreshka#select`](/ru/api/matreshka/select/)

## Примеры

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.select(object, '.my-element');
```
