---
title: "Matreshka#nodes"
sidebarTitle: "nodes"
description: "Matreshka#nodes: Объект содержит привязанные элементы для быстрого доступа, в виде отдельных DOM узлов."
importance: 3
---

# Matreshka#nodes

**Свойство** · Начиная с версии 1.1

```js
Matreshka#nodes: node
```

Объект содержит привязанные элементы для быстрого доступа, в виде отдельных DOM узлов.

Обратите внимание, каждое свойство объекта содержит первый узел из связанных с соотвутствующим свойством. Для получения всех узлов, связанных с определенным свойством, используйте [`Matreshka#$nodes`](/ru/api/matreshka/dollar-nodes/).

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindNode('myKey', '.my-node');
this.nodes.myKey; // то же самое, что и document.querySelector('.my-node')
```
