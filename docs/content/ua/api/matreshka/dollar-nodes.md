---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Об’єкт, у якому для кожної властивості зберігається масив прив’язаних до неї елементів — для швидкого доступу."
importance: 3
---

# Matreshka#$nodes

**Властивість** · Починаючи з версії 1.1

```js
Matreshka#$nodes: $nodes
```

Об’єкт, у якому для кожної властивості зберігається масив прив’язаних до неї елементів — для швидкого доступу.

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // масив з тими самими елементами, що й [...document.querySelectorAll('.my-node')]
```
