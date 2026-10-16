---
title: "Matreshka.once"
sidebarTitle: "once"
description: "Matreshka.once: Добавляет обработчик события, который может быть вызван однажды"
importance: 3
---

# Matreshka.once

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { once } from 'matreshka';
```

```js
Matreshka.once() → object
```

Добавляет обработчик события, который может быть вызван однажды

Этот статичный метод работает так же, как и [`Matreshka#once`](/ru/api/matreshka/once/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#once`](/ru/api/matreshka/once/)

## Примеры

```js
const object = {};
Matreshka.once(object, 'foo', evt => {
	//...
});
```
