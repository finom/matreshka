---
title: "eventHandler"
sidebarTitle: "eventHandler"
description: "eventHandler: Функція-обробник події. Приймає будь-які аргументи, передані в Matreshka#trigger"
importance: 2
---

# eventHandler

**Тип**

Функція-обробник події. Приймає будь-які аргументи, передані в [`Matreshka#trigger`](/ua/api/matreshka/trigger/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `options` | `...*` | будь-які аргументи, передані в виклик [`Matreshka#trigger`](/ua/api/matreshka/trigger/) після імені події |

## Приклади

```js
const eventHandler = (...args) => {
	console.log(args);
};
this.on('fyeah', eventHandler);
// logs 'foo', 'bar', 'baz'
this.trigger('fyeah', 'foo', 'bar', 'baz');
```
