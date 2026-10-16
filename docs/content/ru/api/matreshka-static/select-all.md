---
title: "Matreshka.selectAll"
sidebarTitle: "selectAll"
description: "Matreshka.selectAll: Возвращает элементы из песочницы, соответствующие селектору"
importance: 3
---

# Matreshka.selectAll

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import selectAll from 'matreshka/selectall';
```

```js
Matreshka.selectAll() → $nodes
```

Возвращает элементы из песочницы, соответствующие селектору

Этот статичный метод работает так же, как и [`Matreshka#selectAll`](/ru/api/matreshka/select-all/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`$nodes`](/ru/api/types/dollar-nodes/) – найденные элементы

## Ссылки

- [`Matreshka#selectAll`](/ru/api/matreshka/select-all/)

## Примеры

```js
const object = {};
Matreshka.bindNode(object, 'sandbox', '.app');
Matreshka.selectAll(object, '.my-element');
```
