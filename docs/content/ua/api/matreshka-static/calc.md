---
title: "Matreshka.calc"
sidebarTitle: "calc"
description: "Matreshka.calc: Створює залежність значення одної властивості від значень інших"
importance: 1
---

# Matreshka.calc

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import { calc } from 'matreshka';
```

```js
Matreshka.calc() → object
```

Створює залежність значення одної властивості від значень інших

Цей статичний метод працює так само, як і [`Matreshka#calc`](/ua/api/matreshka/calc/) та всі його варіації, але приймає в якості першого аргументу будь JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#calc`](/ua/api/matreshka/calc/)

## Приклади

```js
const object = {};
object.a = 40;
object.b = 2;
Matreshka.calc(object, 'sum', ['a', 'b'], (a, b) => a + b);
alert(object.sum); // 42
```
