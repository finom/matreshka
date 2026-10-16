---
title: "Matreshka.instantiate"
sidebarTitle: "instantiate"
description: "Matreshka.instantiate: Создаёт фиксированный экземпляр класса"
importance: 3
---

# Matreshka.instantiate

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import instantiate from 'matreshka/instantiate';
```

```js
Matreshka.instantiate() → object
```

Создаёт фиксированный экземпляр класса

Этот статичный метод работает так же, как и [`Matreshka#instantiate`](/ru/api/matreshka/instantiate/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#instantiate`](/ru/api/matreshka/instantiate/)

## Примеры

```js
const object = {};
Matreshka.instantiate(object, 'x', SomeClass);
object.x = { a: 42 };
alert(this.x instanceof SomeClass); // true
alert(this.x.a); // 42
```
