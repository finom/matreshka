---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Объект, в котором для каждого свойства хранится массив привязанных к нему элементов — для быстрого доступа."
importance: 3
---

# Matreshka#$nodes

**Свойство** · Начиная с версии 1.1

```js
Matreshka#$nodes: $nodes
```

Объект, в котором для каждого свойства хранится массив привязанных к нему элементов — для быстрого доступа.

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // массив с теми же элементами, что и [...document.querySelectorAll('.my-node')]
```
