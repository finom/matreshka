---
title: "Matreshka.on"
sidebarTitle: "on"
description: "Matreshka.on: Додає обробник події. Matreshka.js довідник API"
importance: 1
---

# Matreshka.on

**Метод**

**Імпорт:**

```js
import { on } from 'matreshka';
```

```js
Matreshka.on() → object
```

Додає обробник події

Цей статичний метод працює так само, як і [`Matreshka#on`](/ua/api/matreshka/on/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#on`](/ua/api/matreshka/on/)

## Приклади

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	alert(evt.hello);
});

Matreshka.trigger(object, 'foo', { hello: 'World' });
```
