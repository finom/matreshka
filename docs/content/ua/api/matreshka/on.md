---
title: "Matreshka#on"
sidebarTitle: "on"
description: "Matreshka#on: Додає обробник події. Matreshka.js довідник API"
importance: 1
---

# Matreshka#on

**Метод** · Починаючи з версії 1.1

```js
Matreshka#on(names, callback, [triggerOnInit=false], [context]) → object
```

Додає обробник події

Метод [`Matreshka#on`](/ua/api/matreshka/on/) додає обробник події для екземпляра класу ``Matreshka``. Повний список можливих подій з описом см. Тут: [`eventNames`](/ua/api/types/event-names/).

> Зверніть увагу, що у методва є [статичний аналог](/ua/api/matreshka-static/on/), який працює в точності так само, але приймає будь-який об'єкт в якості першого аргументу, зсуваючи інші аргументи вправо.
```js
import on from 'matreshka/on';
const object = {};
on(object, names, callback, triggerOnInit, context);
// Замість this.on(names, callback, triggerOnInit, context);
```

Повторне додавання того самого обробника з тим самим контекстом для тієї самої події нічого не змінює. Для DOM подій (``click::x``) діє те саме правило.

**Повертає:** [`object`](/ua/api/types/object/) – self

**Генерує події:** `addevent`, `addevent:NAME`

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `names` |  | [`eventNames`](/ua/api/types/event-names/) | Ім'я події або кілька імен, розділених пробілом (наприклад, ``"change:x ajaxcomplete change:y"``) |
| `callback` |  | [`eventHandler`](/ua/api/types/event-handler/) | Функція, яка викликається за подією |
| `triggerOnInit` (необов'язковий) | `false` | [`boolean`](/ua/api/types/boolean/) | Якщо аргумент ``triggerOnInit`` дорівнює ``true``, то обробник буде викликаний негайно після ініціалізації. |
| `context` (необов'язковий) |  | [`object`](/ua/api/types/object/) | Контекст обробника. Іншими словами, ``this`` при виклику ``callback`` |

## Посилання

- [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/)
- [`Matreshka#once`](/ua/api/matreshka/once/)
- [`Matreshka#off`](/ua/api/matreshka/off/)
- [`Matreshka#trigger`](/ua/api/matreshka/trigger/)

## Приклади

```js
this.on('foo', () => {
	alert('Custom Event is fired');
});

this.trigger('foo');
```

**Передача контексту**

```js
this.on('foo', function() {
	alert(this.a); // 5
}, { a: 5 });

this.trigger('foo', 'Hello world');
```

**Виклик обробника відразу після ініціалізації**

```js
// Виводить на екран "bar" моментально і чекає на подію "foo"
this.on('foo', () => {
	alert('bar');
}, true);
```

## Альтернативний синтаксис: пари "подія-обробник" [#variation-2]

```js
Matreshka#on(evtnameHandlerObject, [triggerOnInit=false], [context]) → object
```

У метод [`Matreshka#on`](/ua/api/matreshka/on/) можна передати об'єкт з парами подія-обробник, щоб уникнути багаторазового виклику методу і скоротити код.

**Повертає:** [`object`](/ua/api/types/object/) – self

### Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `evtnameHandlerObject` |  | [`object`](/ua/api/types/object/) | Об'єкт з подіями |
| `triggerOnInit` (необов'язковий) | `false` | [`boolean`](/ua/api/types/boolean/) | Якщо аргумент ``triggerOnInit`` дорівнює ``true``, то обробники будуть викликані негайно після ініціалізації |
| `context` (необов'язковий) |  | [`object`](/ua/api/types/object/) | Контекст обробника |

### Приклади

```js
this.on({
	'custom': evt => ...,
	'click::x': evt => ...,
	'change:y': evt => ...,
});
```
