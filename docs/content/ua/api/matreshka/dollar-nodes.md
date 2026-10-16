---
title: "Matreshka#$nodes"
sidebarTitle: "$nodes"
description: "Matreshka#$nodes: Об'єкт містить колекції (jQuery, Zepto, інстанси вбудованої мікро-бібліотеки, успадкованої від Array.prototype) прив'язаних елементів для…"
importance: 3
---

# Matreshka#$nodes

**Властивість** · Починаючи з версії 1.1

```js
Matreshka#$nodes: $nodes
```

Об'єкт містить колекції (jQuery, Zepto, інстанси вбудованої мікро-бібліотеки, успадкованої від ``Array.prototype``) прив'язаних елементів для швидкого доступу.

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindNode('myKey', '.my-node');
this.$nodes.myKey; // Те ж саме, що і $('.my-node')
```
