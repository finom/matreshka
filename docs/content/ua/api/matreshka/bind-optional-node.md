---
title: "Matreshka#bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka#bindOptionalNode: Працює в точності так само, як і Matreshka#bindNode але не кидає виняток, якщо аргумент node - порожній масив, undefined або не…"
importance: 2
---

# Matreshka#bindOptionalNode

**Метод** · Починаючи з версії 0.3

```js
Matreshka#bindOptionalNode()
```

Працює в точності так само, як і [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) але не кидає виняток, якщо аргумент ``node`` - порожній масив, ``undefined`` або не існує

> У метода є [статичный аналог](/ua/api/matreshka-static/bind-optional-node/).

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)

## Приклади

```js
this.bindOptionalNode('myKey', '.my-element');
```
