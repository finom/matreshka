---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Об'єкт містить масиви прив'язаних елементів для швидкого доступу."
importance: 3
---

# Matreshka#$nodes

**Властивість**

```js
Matreshka#$nodes: $nodes
```

Об'єкт містить масиви прив'язаних елементів для швидкого доступу.

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // масив вузлів, як Array.from(document.querySelectorAll('.my-node'))
```
