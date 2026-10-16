---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Объект содержит массивы привязанных элементов для быстрого доступа."
importance: 3
---

# Matreshka#$nodes

**Свойство** · Начиная с версии 1.1

```js
Matreshka#$nodes: $nodes
```

Объект содержит массивы привязанных элементов для быстрого доступа.

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // массив узлов, как Array.from(document.querySelectorAll('.my-node'))
```
