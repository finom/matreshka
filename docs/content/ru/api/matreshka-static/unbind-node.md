---
title: "Matreshka.unbindNode"
sidebarTitle: "unbindNode"
description: "Matreshka.unbindNode: Разрывает связь между свойством и HTML элементом"
importance: 3
---

# Matreshka.unbindNode

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { unbindNode } from 'matreshka';
```

```js
Matreshka.unbindNode() → object
```

Разрывает связь между свойством и HTML элементом

Этот статичный метод работает так же, как и [`Matreshka#unbindNode`](/ru/api/matreshka/unbind-node/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#unbindNode`](/ru/api/matreshka/unbind-node/)

## Примеры

```js
const object = {};
Matreshka.unbindNode(object, 'x', '.my-node');
```
