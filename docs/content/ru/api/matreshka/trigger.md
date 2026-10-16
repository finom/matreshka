---
title: "Matreshka#trigger"
sidebarTitle: "trigger"
description: "Matreshka#trigger: Генерирует событие. Matreshka.js справочник API"
importance: 1
---

# Matreshka#trigger

**Метод**

```js
Matreshka#trigger([names], [arg]) → object
```

Генерирует событие

После добавление обработчиков событий с помощью метода [`Matreshka#on`](/ru/api/matreshka/on/), [`Matreshka#onDebounce`](/ru/api/matreshka/on-debounce/) или [`Matreshka#once`](/ru/api/matreshka/once/), событие можно генерировать вручную с помощью этого метода.

> Обратите внимание, что у метода есть [статичный аналог](/ru/api/matreshka-static/trigger/).

**Возвращает:** [`object`](/ru/api/types/object/) – self

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `names` (необязательный) | [`eventNames`](/ru/api/types/event-names/) | Имя события или несколько имен, разделенных пробелом |
| `arg` (необязательный) | `...*` | Аргументы, которые будут переданы обработчикам |

## Ссылки

- [`Matreshka#on`](/ru/api/matreshka/on/)
- [`Matreshka#once`](/ru/api/matreshka/once/)
- [`Matreshka#onDebounce`](/ru/api/matreshka/on-debounce/)
- [`Matreshka#off`](/ru/api/matreshka/off/)

## Примеры

```js
this.on('foo bar', (a, b, c) => {
	alert(a + b + c);
});
this.trigger('bar', 1, 2, 3); // alerts 6
```
