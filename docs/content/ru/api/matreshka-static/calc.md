---
title: "Matreshka.calc"
sidebarTitle: "calc"
description: "Matreshka.calc: Создает зависимость значения одного свойства от значений других"
importance: 1
---

# Matreshka.calc

**Метод**

**Импорт:**

```js
import { calc } from 'matreshka';
```

```js
Matreshka.calc() → object
```

Создает зависимость значения одного свойства от значений других

Этот статичный метод работает так же, как и [`Matreshka#calc`](/ru/api/matreshka/calc/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#calc`](/ru/api/matreshka/calc/)

## Примеры

```js
const object = {};
object.a = 40;
object.b = 2;
Matreshka.calc(object, 'sum', ['a', 'b'], (a, b) => a + b);
alert(object.sum); // 42
```
