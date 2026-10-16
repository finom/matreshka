---
title: "eventHandler"
sidebarTitle: "eventHandler"
description: "eventHandler: Функция-обработчик события. Принимает любые аргументы, переданные в Matreshka#trigger"
importance: 2
---

# eventHandler

**Тип**

Функция-обработчик события. Принимает любые аргументы, переданные в [`Matreshka#trigger`](/ru/api/matreshka/trigger/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `options` | `...*` | любые аргументы, переданные в вызов [`Matreshka#trigger`](/ru/api/matreshka/trigger/) после имени события |

## Примеры

```js
const eventHandler = (...args) => {
	console.log(args);
};
this.on('fyeah', eventHandler);
// logs 'foo', 'bar', 'baz'
this.trigger('fyeah', 'foo', 'bar', 'baz');
```
