---
title: "Matreshka#select"
sidebarTitle: "select"
description: "Matreshka#select: Возвращает элемент из песочницы, соответствующий селектору"
importance: 2
---

# Matreshka#select

**Метод**

```js
Matreshka#select(selector) → node|null
```

Возвращает элемент из песочницы, соответствующий селектору

Метод очень похож на [`Matreshka#selectAll`](/ru/api/matreshka/select-all/), но возвращает лишь один элемент или ``null``

> У метода есть [статичный аналог](/ru/api/matreshka-static/select/).

**Возвращает:** [`node`](/ru/api/types/node/) \| [`null`](/ru/api/types/null/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `selector` | [`string`](/ru/api/types/string/) | Селектор |

## Примеры

```js
this.bindNode('sandbox', '.app');
this.select('.my-element');
// то же самое, что и
this.nodes.sandbox.querySelector('.my-element');
// и то же самое, что и
document.querySelector('.app .my-element');
```
