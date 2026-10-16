---
title: "Matreshka.off"
sidebarTitle: "off"
description: "Matreshka.off: Видаляє обробник події. Matreshka.js довідник API"
importance: 3
---

# Matreshka.off

**Метод**

**Імпорт:**

```js
import { off } from 'matreshka';
```

```js
Matreshka.off() → object
```

Видаляє обробник події

Цей статичний метод працює так само, як і [`Matreshka#off`](/ua/api/matreshka/off/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

Якщо передати тільки об'єкт, метод видаляє всі обробники, додані через ``on``, ``once`` і ``onDebounce``; прив'язки й залежності ``calc`` залишаються.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#off`](/ua/api/matreshka/off/)

## Приклади

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	//...
});

Matreshka.off(object, 'foo');
```
