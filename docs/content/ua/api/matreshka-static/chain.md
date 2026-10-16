---
title: "Matreshka.chain"
sidebarTitle: "chain"
description: "Matreshka.chain: Дозволяє викликати універсальні методи ланцюгом"
importance: 2
---

# Matreshka.chain

**Метод**

**Імпорт:**

```js
import { chain } from 'matreshka';
```

```js
Matreshka.chain(object) → object
```

Дозволяє викликати універсальні методи ланцюгом

Функція приймає будь-який об'єкт і повертає екземпляр недоступного ззовні класу, який переймає універсальні методи, дозволяючи їх ланцюговий виклик для роботи з переданим об'єктом.

> Універсальні методи - це такі методи, які одночасно є в прототипі [`Matreshka`](/ua/api/matreshka/) і мають статичний аналог (наприклад, [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) і [`Matreshka.bindNode`](/ua/api/matreshka-static/bind-node/)).

**Повертає:** [`object`](/ua/api/types/object/) – Екземпляр недоступного ззовні класу

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `object` | [`object`](/ua/api/types/object/) \| [`function`](/ua/api/types/function/) | Об'єкт |

## Приклади

```js
const object = {};
Matreshka.chain(object)
    .calc('a', 'b', b => b * 2)
    .set('b', 3)
    .bindNode('c', '.node');

// те ж саме, що і
// Matreshka.calc(object, 'a', 'b', b => b * 2)
// Matreshka.set(object, 'b', 3)
// Matreshka.bindNode(object, 'c', '.node');
```
