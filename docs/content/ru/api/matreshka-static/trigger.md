---
title: "Matreshka.trigger"
sidebarTitle: "trigger"
description: "Matreshka.trigger: Генерирует событие. Matreshka.js справочник API"
importance: 3
---

# Matreshka.trigger

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { trigger } from 'matreshka';
```

```js
Matreshka.trigger() → object
```

Генерирует событие

Этот статичный метод работает так же, как и [`Matreshka#trigger`](/ru/api/matreshka/trigger/) и все его вариации, но принимает в качестве первого аргумента любой JavaScript объект.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Ссылки

- [`Matreshka#trigger`](/ru/api/matreshka/trigger/)

## Примеры

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	alert(evt.hello);
});

Matreshka.trigger(object, 'foo', { hello: 'World' });
```
