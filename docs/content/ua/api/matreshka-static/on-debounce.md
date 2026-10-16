---
title: "Matreshka.onDebounce"
sidebarTitle: "onDebounce"
description: "Matreshka.onDebounce: Додатє обробник події, що викликається лише однин раз за певний проміжок часу"
importance: 3
---

# Matreshka.onDebounce

**Метод**

**Імпорт:**

```js
import { onDebounce } from 'matreshka';
```

```js
Matreshka.onDebounce() → object
```

Додатє обробник події, що викликається лише однин раз за певний проміжок часу

Цей статичний метод працює так само, як і [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/)

## Приклади

```js
const object = {};
Matreshka.onDebounce(object, 'foo', evt => {
	//...
});
```
