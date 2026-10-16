---
title: "Matreshka.trigger"
sidebarTitle: "trigger"
description: "Matreshka.trigger: Генерує подію. Matreshka.js довідник API"
importance: 3
---

# Matreshka.trigger

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import trigger from 'matreshka/trigger';
```

```js
Matreshka.trigger() → object
```

Генерує подію

Цей статичний метод працює так само, як і [`Matreshka#trigger`](/ua/api/matreshka/trigger/) та всі його варіації, але приймає в якості першого аргументу будь-який JavaScript об'єкт.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Посилання

- [`Matreshka#trigger`](/ua/api/matreshka/trigger/)

## Приклади

```js
const object = {};
Matreshka.on(object, 'foo', evt => {
	alert(evt.hello);
});

Matreshka.trigger(object, 'foo', { hello: 'World' });
```
