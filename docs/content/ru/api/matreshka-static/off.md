---
title: "Matreshka.off"
sidebarTitle: "off"
description: "Matreshka.off: Удаляет обработчик события. Matreshka.js справочник API"
importance: 3
---

# Matreshka.off

**Метод**

**Импорт:**

```js
import { off } from 'matreshka';
```

```js
Matreshka.off() → object
```

Удаляет обработчик события

Этот статичный метод работает так же, как и [`Matreshka#off`](/ru/api/matreshka/off/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

Если передать только объект, метод удаляет все обработчики, добавленные через ``on``, ``once`` и ``onDebounce``; привязки и зависимости ``calc`` остаются.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#off`](/ru/api/matreshka/off/)

## Примеры

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	//...
});

Matreshka.off(object, 'foo');
```
