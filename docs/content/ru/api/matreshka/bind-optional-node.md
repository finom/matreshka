---
title: "Matreshka#bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka#bindOptionalNode: Работает в точности так же, как и Matreshka#bindNode но не бросает исключение, если аргумент node - пустой массив, undefined или…"
importance: 2
---

# Matreshka#bindOptionalNode

**Метод** · Начиная с версии 0.3

```js
Matreshka#bindOptionalNode()
```

Работает в точности так же, как и [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) но не бросает исключение, если аргумент ``node`` - пустой массив, ``undefined`` или не существует

> У метода есть [статичный аналог](/ru/api/matreshka-static/bind-optional-node/).

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)

## Примеры

```js
this.bindOptionalNode('myKey', '.my-element');
```
