---
title: "Matreshka.remove"
sidebarTitle: "remove"
description: "Matreshka.remove: Удаляет свойство. Matreshka.js справочник API"
importance: 3
---

# Matreshka.remove

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { remove } from 'matreshka';
```

```js
Matreshka.remove() → object
```

Удаляет свойство

Этот статичный метод работает так же, как и [`Matreshka#remove`](/ru/api/matreshka/remove/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#remove`](/ru/api/matreshka/remove/)

## Примеры

```js
Matreshka.remove(object, 'x');
```
