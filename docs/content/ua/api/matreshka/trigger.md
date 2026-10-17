---
title: "Matreshka#trigger"
sidebarTitle: "trigger"
description: "Matreshka#trigger: Генерує подію. Matreshka.js довідник API"
importance: 1
---

# Matreshka#trigger

**Метод**

```js
Matreshka#trigger(names, [arg]) → object
```

Генерує подію

Після додавання обробників подій за допомогою методу [`Matreshka#on`](/ua/api/matreshka/on/), [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/) або [`Matreshka#once`](/ua/api/matreshka/once/), подія може бути сгенерована вручну за допомогою цього методу.

> Зверніть увагу, що у метода є [статичний аналог](/ua/api/matreshka-static/trigger/).

**Повертає:** [`object`](/ua/api/types/object/) – self

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `names` | [`eventNames`](/ua/api/types/event-names/) | Ім'я події або кілька імен, розділених пробілом |
| `arg` (необов'язковий) | `...*` | Аргументи, які будуть передані обробникам |

## Посилання

- [`Matreshka#on`](/ua/api/matreshka/on/)
- [`Matreshka#once`](/ua/api/matreshka/once/)
- [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/)
- [`Matreshka#off`](/ua/api/matreshka/off/)

## Приклади

```js
this.on('foo bar', (a, b, c) => {
	alert(a + b + c);
});
this.trigger('bar', 1, 2, 3); // alerts 6
```
