---
title: "Matreshka#nodes"
sidebarTitle: "nodes"
description: "Matreshka#nodes: Об'єкт містить прив'язані елементи для швидкого доступу, у вигляді окремих DOM вузлів."
importance: 3
---

# Matreshka#nodes

**Властивість** · Починаючи з версії 1.1

```js
Matreshka#nodes: node
```

Об'єкт містить прив'язані елементи для швидкого доступу, у вигляді окремих DOM вузлів.

Зверніть увагу, кожна властивість об'єкта містить перший вузол з пов'язаних з соотвутствующий властивістю. Для отримання всіх вузлів, пов'язаних з певною властивістю, використовуйте [`Matreshka#$nodes`](/ua/api/matreshka/dollar-nodes/).

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindNode('myKey', '.my-node');
this.nodes.myKey; // Те ж саме, що і $('.my-node')[0]
```
