---
title: "Matreshka#select"
sidebarTitle: "select"
description: "Matreshka#select: Повертає елемент з пісочниці, відповідний селектору"
importance: 2
---

# Matreshka#select

**Метод**

```js
Matreshka#select(selector) → node|null
```

Повертає елемент з пісочниці, відповідний селектору

Метод дуже схожий на [`Matreshka#selectAll`](/ua/api/matreshka/select-all/), але повертає лише один елемент або ``null``

> У метода є [статичний аналог](/ua/api/matreshka-static/select/).

**Повертає:** [`node`](/ua/api/types/node/) \| [`null`](/ua/api/types/null/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `selector` | [`string`](/ua/api/types/string/) | Селектор |

## Приклади

```js
this.bindNode('sandbox', '.app');
this.select('.my-element');
// те ж саме, що і
this.nodes.sandbox.querySelector('.my-element');
// те саме, що й
document.querySelector('.app .my-element');
```
