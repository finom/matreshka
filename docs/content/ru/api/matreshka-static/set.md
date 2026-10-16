---
title: "Matreshka.set"
sidebarTitle: "set"
description: "Matreshka.set: Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента"
importance: 3
---

# Matreshka.set

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { set } from 'matreshka';
```

```js
Matreshka.set() → object
```

Устанавливает значение свойства, позволяя передать объект события в качестве третьего аргумента

Этот статичный метод работает так же, как и [`Matreshka#set`](/ru/api/matreshka/set/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#set`](/ru/api/matreshka/set/)

## Примеры

```js
const object = {};
Matreshka.set(object, 'x', 42, {
	someOption: true
});
```
