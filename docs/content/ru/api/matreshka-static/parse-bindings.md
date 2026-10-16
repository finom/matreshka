---
title: "Matreshka.parseBindings"
sidebarTitle: "parseBindings"
description: "Matreshka.parseBindings: Парсит DOM дерево, объявляя привязки свойств, заключенных в двойные фигурные скобки."
importance: 3
---

# Matreshka.parseBindings

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { parseBindings } from 'matreshka';
```

```js
Matreshka.parseBindings() → $nodes
```

Парсит DOM дерево, объявляя привязки свойств, заключенных в двойные фигурные скобки.

Этот статичный метод работает так же, как и [`Matreshka#parseBindings`](/ru/api/matreshka/parse-bindings/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`$nodes`](/ru/api/types/dollar-nodes/) – Коллекция обработанных DOM узлов, переданная в функцию в качестве аргумента

## Ссылки

- [`Matreshka#parseBindings`](/ru/api/matreshka/parse-bindings/)

## Примеры

```js
const object = {};
const $node = Matreshka.parseBindings(object, `<h3>
        Hello, {{name}}
    </h3>`);
object.name = 'World';
```
