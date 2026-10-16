---
title: "Matreshka#mediate"
sidebarTitle: "mediate"
description: "Matreshka#mediate: Трансформує значення властивості при його зміні"
importance: 2
---

# Matreshka#mediate

**Метод**

```js
Matreshka#mediate(key, mediator)
```

Трансформує значення властивості при його зміні

Цей метод використовується для перетворення значення властивості при його зміні. Наприклад, вам потрібно, щоб значення властивості завжди було або певного типу, або цілим числом, або бути не менше нуля і не більше ста тощо.

> Зверніть увагу, що у метода є [статичний аналог](/ua/api/matreshka-static/mediate/), який працює в точності так само, але приймає будь-який об'єкт в якості першого аргументу, зсуваючи інші аргументи вправо.
```js
import { mediate } from 'matreshka';
const object = {};
mediate(object, key, mediator);
// Замість this.mediate(key, mediator);
```

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `key` | [`string`](/ua/api/types/string/) \| [`array`](/ua/api/types/array/) | Ім'я властивості або масив імен |
| `mediator` | [`function`](/ua/api/types/function/) | Функція-посередник (медіатор, mediator), яка повертає нове значення. У неї передаються такі аргументи: нове значення, попереднє значення, ім'я властивості, сам об'єкт |

## Приклади

```js
this.mediate('x', value => String(value));
this.x = 1;
alert(typeof this.x); // "string"
```

**Масив ключів**

```js
this.mediate(['x', 'y'], value => String(value));
```

## Альтернативный синтаксис методу Matreshka#mediate, приймаючий в якості аргументу об'єкт "ключ-медіатор" [#variation-2]

```js
Matreshka#mediate(keyMediatorPairs)
```

### Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `keyMediatorPairs` | [`object`](/ua/api/types/object/) | Об'ект із властивостями ключ-медіатор |

### Приклади

```js
this.mediate({
	x: String,
	y: Number,
	z: Boolean
});
this.x = 1;
this.y = 2;
this.z = 3;
alert(typeof this.x); // "string"
alert(typeof this.y); // "number"
alert(typeof this.z); // "boolean"
```
