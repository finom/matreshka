---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Объект содержит коллекции (jQuery, Zepto, инстанс встроенной микро-библиотеки, унаследованной от Array.prototype) привязанных элементов для…"
importance: 3
---

# Matreshka#$nodes

**Свойство** · Начиная с версии 1.1

```js
Matreshka#$nodes: $nodes
```

Объект содержит коллекции (jQuery, Zepto, инстанс встроенной микро-библиотеки, унаследованной от ``Array.prototype``) привязанных элементов для быстрого доступа.

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // то же самое, что и $('.my-node')
```
