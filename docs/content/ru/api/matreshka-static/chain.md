---
title: "Matreshka.chain"
sidebarTitle: "chain"
description: "Matreshka.chain: Позволяет вызывать универсальные методы цепочкой"
importance: 2
---

# Matreshka.chain

**Метод** · Начиная с версии 2.0

**Импорт:**

```js
import { chain } from 'matreshka';
```

```js
Matreshka.chain(object) → object
```

Позволяет вызывать универсальные методы цепочкой

Функция принимает любой объект и возвращает экземпляр недоступного извне класса, который перенимает универсальные методы, позволяя их цепной вызов для работы с переданным объектом.

> Универсальные методы - это такие методы, которые одновременно есть в прототипе [`Matreshka`](/ru/api/matreshka/) и имеют статичный аналог (например, [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) и [`Matreshka.bindNode`](/ru/api/matreshka-static/bind-node/)).

**Возвращает:** [`object`](/ru/api/types/object/) – Экземпляр недоступного извне класса

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `object` | [`object`](/ru/api/types/object/) \| [`function`](/ru/api/types/function/) | Объект |

## Примеры

```js
const object = {};
Matreshka.chain(object)
    .calc('a', 'b', b => b * 2)
    .set('b', 3)
    .bindNode('c', '.node');

// то же самое, что и
// Matreshka.calc(object, 'a', 'b', b => b * 2)
// Matreshka.set(object, 'b', 3)
// Matreshka.bindNode(object, 'c', '.node');
```
