---
title: "Matreshka.onDebounce"
sidebarTitle: "onDebounce"
description: "Matreshka.onDebounce: Добавляет обработчик события, вызываемый лишь однажды за определенный промежуток времени"
importance: 3
---

# Matreshka.onDebounce

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { onDebounce } from 'matreshka';
```

```js
Matreshka.onDebounce() → object
```

Добавляет обработчик события, вызываемый лишь однажды за определенный промежуток времени

Этот статичный метод работает так же, как и [`Matreshka#onDebounce`](/ru/api/matreshka/on-debounce/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#onDebounce`](/ru/api/matreshka/on-debounce/)

## Примеры

```js
const object = {};
Matreshka.onDebounce(object, 'foo', evt => {
	//...
});
```
