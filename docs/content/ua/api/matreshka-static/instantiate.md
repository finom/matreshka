---
title: "Matreshka.instantiate"
sidebarTitle: "instantiate"
description: "Matreshka.instantiate: Створює фіксований екземпляр класу"
importance: 3
---

# Matreshka.instantiate

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import instantiate from 'matreshka/instantiate';
```

```js
Matreshka.instantiate() → object
```

Створює фіксований екземпляр класу

Цей статичний метод працює так само, як і [`Matreshka#instantiate`](/ua/api/matreshka/instantiate/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#instantiate`](/ua/api/matreshka/instantiate/)

## Приклади

```js
const object = {};
Matreshka.instantiate(object, 'x', SomeClass);
object.x = { a: 42 };
alert(this.x instanceof SomeClass); // true
alert(this.x.a); // 42
```
