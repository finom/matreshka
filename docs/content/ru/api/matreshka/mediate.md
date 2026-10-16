---
title: "Matreshka#mediate"
sidebarTitle: "mediate"
description: "Matreshka#mediate: Трансформирует значение свойства при его изменении"
importance: 2
---

# Matreshka#mediate

**Метод**

```js
Matreshka#mediate(key, mediator)
```

Трансформирует значение свойства при его изменении

Этот метод используется для преобразования значения свойства при его изменении. Например, вам нужно, чтоб значение свойства всегда было либо определенного типа, либо целым числом, либо быть не менее нуля и не более ста и т. д.

> Обратите внимание, что у метода есть [статичный аналог](/ru/api/matreshka-static/mediate/), который работает в точности так же, но принимает любой объект в качестве первого аргумента, cдвигая остальные аргументы вправо.
```js
import { mediate } from 'matreshka';
const object = {};
mediate(object, key, mediator);
// вместо this.mediate(key, mediator);
```

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `key` | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Имя свойства или массив имен |
| `mediator` | [`function`](/ru/api/types/function/) | Функция-посредник (медиатор, mediator), возвращающая новое значение. В неё передаются следующие аргументы: новое значение, предыдущее значение, имя свойства, сам объект |

## Примеры

```js
this.mediate('x', value => String(value));
this.x = 1;
alert(typeof this.x); // "string"
```

**Массив ключей**

```js
this.mediate(['x', 'y'], value => String(value));
```

## Альтернативный синтаксис метода Matreshka#mediate, принимающий в качестве аргумента объект "ключ-медиатор" [#variation-2]

```js
Matreshka#mediate(keyMediatorPairs)
```

### Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `keyMediatorPairs` | [`object`](/ru/api/types/object/) | Объект со свойствами ключ-медиатор |

### Примеры

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
