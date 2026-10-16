---
title: "Matreshka#selectAll"
sidebarTitle: "selectAll"
description: "Matreshka#selectAll: Повертає елементи з пісочниці, що відповідають селектору"
importance: 2
---

# Matreshka#selectAll

**Метод**

```js
Matreshka#selectAll(selector) → $nodes
```

Повертає елементи з пісочниці, що відповідають селектору

Синонім: `Matreshka#$`

Повертає звичайний масив елементів; якщо нічого не знайдено, масив порожній.

Після створення пісочниці методом [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/), можна отримувати і використовувати елементи, що знаходяться в ній. Крім цього, метод підтримує кастомний селектор ``:bound(KEY)``.

> У метода є [статичний аналог](/ua/api/matreshka-static/select-all/).

**Повертає:** [`$nodes`](/ua/api/types/dollar-nodes/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `selector` | [`string`](/ua/api/types/string/) | Cелектор |

## Приклади

```js
this.bindNode('sandbox', '.app');
nodes = this.selectAll('.my-element');
// те ж саме, що і
nodes = this.$('.my-element'); // $ - посилання на метод selectAll
// те ж саме, що і
nodes = [...document.querySelector('.app').querySelectorAll('.my-element')];
```

**Селектор ``:bound(KEY)``**

```js
this.bindNode('myKey', '.my-element');
nodes = this.selectAll(':bound(myKey) .my-another-element');
// те ж саме, що і
nodes = [...document.querySelector('.my-element').querySelectorAll('.my-another-element')];
```
