---
title: "Matreshka.set"
sidebarTitle: "set"
description: "Matreshka.set: Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу"
importance: 3
---

# Matreshka.set

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import { set } from 'matreshka';
```

```js
Matreshka.set() → object
```

Встановлює значення властивості, дозволяючи передати об'єкт події в якості третьої аргументу

Цей статичний метод працює так само, як і [`Matreshka#set`](/ua/api/matreshka/set/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#set`](/ua/api/matreshka/set/)

## Приклади

```js
const object = {};
Matreshka.set(object, 'x', 42, {
	someOption: true
});
```
