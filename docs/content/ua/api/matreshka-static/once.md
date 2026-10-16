---
title: "Matreshka.once"
sidebarTitle: "once"
description: "Matreshka.once: Додає обробник події, який може бути викликаний лише один раз"
importance: 3
---

# Matreshka.once

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import once from 'matreshka/once';
```

```js
Matreshka.once() → object
```

Додає обробник події, який може бути викликаний лише один раз

Цей статичний метод працює так само, як і [`Matreshka#once`](/ua/api/matreshka/once/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#once`](/ua/api/matreshka/once/)

## Приклади

```js
const object = {};
Matreshka.once(object, 'foo', evt => {
	//...
});
```
