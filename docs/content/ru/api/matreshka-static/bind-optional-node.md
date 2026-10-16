---
title: "Matreshka.bindOptionalNode"
sidebarTitle: "bindOptionalNode"
description: "Matreshka.bindOptionalNode: Связывает элемент со свойством, но не бросает исключение, если аргумент node - пустой массив, undefined или не существует"
importance: 3
---

# Matreshka.bindOptionalNode

**Метод**

**Импорт:**

```js
import { bindOptionalNode } from 'matreshka';
```

```js
Matreshka.bindOptionalNode() → object
```

Связывает элемент со свойством, но не бросает исключение, если аргумент node - пустой массив, ``undefined`` или не существует

Этот статичный метод работает так же, как и [`Matreshka#bindOptionalNode`](/ru/api/matreshka/bind-optional-node/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#bindOptionalNode`](/ru/api/matreshka/bind-optional-node/)

## Примеры

```js
const object = {};
Matreshka.bindOptionalNode(object, 'x', '.my-node');
```
