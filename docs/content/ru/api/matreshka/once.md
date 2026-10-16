---
title: "Matreshka#once"
sidebarTitle: "once"
description: "Matreshka#once: Добавляет обработчик событий, который может быть вызван однажды"
importance: 2
---

# Matreshka#once

**Метод** · Начиная с версии 1.1

```js
Matreshka#once(names, callback, [context]) → object
```

Добавляет обработчик событий, который может быть вызван однажды

Метод работает так же, как и [`Matreshka#on`](/ru/api/matreshka/on/) но передаваемый обработчик может быть вызван только один раз.

> Обратите внимание, что у метода есть [статичный аналог](/ru/api/matreshka-static/once/)

**Возвращает:** [`object`](/ru/api/types/object/) – self

**Генерирует события:** `addevent`, `addevent:NAME`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `names` | [`eventNames`](/ru/api/types/event-names/) | Имя события или несколько имен, разделенных пробелом (например, \<code>"change:x ajaxcomplete change:y"\</code>) |
| `callback` | [`eventHandler`](/ru/api/types/event-handler/) | Функция, которая вызывается по событию |
| `context` (необязательный) | [`object`](/ru/api/types/object/) | Контекст обработчика |

## Ссылки

- [`Matreshka#on`](/ru/api/matreshka/on/)
- [`Matreshka#off`](/ru/api/matreshka/off/)
- [`Matreshka#onDebounce`](/ru/api/matreshka/on-debounce/)
- [`Matreshka#trigger`](/ru/api/matreshka/trigger/)

## Примеры

```js
this.x = 1;

this.once('change:x', () => {
	alert('x is changed');
});

this.x = 2; // выводит 'x is changed'

this.x = 3; // ничего не делает
```

## Альтернативный синтаксис: пары "событие-обработчик" [#variation-2]

```js
Matreshka#once(evtnameHandlerObject, [context]) → object
```

В метод [`Matreshka#once`](/ru/api/matreshka/once/) можно передать объект с парами событие-обработчик, чтобы избежать многократного вызова метода и сократить код.

**Возвращает:** [`object`](/ru/api/types/object/) – self

### Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `evtnameHandlerObject` | [`object`](/ru/api/types/object/) | Объект с событиями |
| `context` (необязательный) | [`object`](/ru/api/types/object/) | Контекст обработчиков |

### Ссылки

- [`Matreshka#on(2)`](/ru/api/matreshka/on/#variation-2)

### Примеры

```js
this.once({
	'custom': evt => { ... },
	'click::x': evt => { ... },
	'change:y': evt => { ... }
});
```
