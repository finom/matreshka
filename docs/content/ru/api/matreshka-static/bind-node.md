---
title: "Matreshka.bindNode"
sidebarTitle: "bindNode"
description: "Matreshka.bindNode: Связывает свойство объекта с HTML элементом"
importance: 1
---

# Matreshka.bindNode

**Метод**

**Импорт:**

```js
import { bindNode } from 'matreshka';
```

```js
Matreshka.bindNode() → object
```

Связывает свойство объекта с HTML элементом

Этот статичный метод работает так же, как и [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
const object = {};
Matreshka.bindNode(object, 'x', '.my-node');
```
