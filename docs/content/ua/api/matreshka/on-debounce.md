---
title: "Matreshka#onDebounce"
sidebarTitle: "onDebounce"
description: "Matreshka#onDebounce: Додає обробник події, що викликається лише одного разу за певний проміжок часу"
importance: 2
---

# Matreshka#onDebounce

**Метод**

```js
Matreshka#onDebounce(names, callback, [debounceDelay=0], [triggerOnInit=false], [context]) → object
```

Додає обробник події, що викликається лише одного разу за певний проміжок часу

Метод дозволяє додати обробник події на екземпляр класу [`Matreshka`](/ua/api/matreshka/), усуваючи "деренчання" обробника. Функція може бути викликана лише один раз за певний проміжок часу. В іншому, метод працює так само, як і [`Matreshka#on`](/ua/api/matreshka/on/).

> У метода є [статичний аналог](/ua/api/matreshka-static/on-debounce/).

**Повертає:** [`object`](/ua/api/types/object/) – self

**Генерує події:** `addevent`, `addevent:NAME`

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `names` |  | [`eventNames`](/ua/api/types/event-names/) | Ім'я події або кілька імен, розділених пробілом (наприклад, \<code>"change:x ajaxcomplete change:y" \</code>) |
| `callback` |  | [`eventHandler`](/ua/api/types/event-handler/) | Функція, яка викликається за подією |
| `debounceDelay` (необов'язковий) | `0` | [`number`](/ua/api/types/number/) | Затримка |
| `triggerOnInit` (необов'язковий) | `false` | [`boolean`](/ua/api/types/boolean/) | Якщо аргумент ``triggerOnInit`` дорівнює ``true``, то обробник буде викликаний негайно після ініціалізації |
| `context` (необов'язковий) |  | [`object`](/ua/api/types/object/) | Контекст обробника |

## Посилання

- [`Matreshka#on`](/ua/api/matreshka/on/)
- [`Matreshka#once`](/ua/api/matreshka/once/)
- [`Matreshka#off`](/ua/api/matreshka/off/)
- [`Matreshka#trigger`](/ua/api/matreshka/trigger/)

## Приклади

```js
this.onDebounce('change:x', () => {
	alert(`x = ${this.x}`); // x = 100
}, 300);

this.x = 1;

for(let i = 0; i < 100; i++) {
	this.x++;
}
```

## Альтернативний синтаксис: пари "подія-обробник" [#variation-2]

```js
Matreshka#onDebounce(evtnameHandlerObject, [debounceDelay=0], [triggerOnInit=false], [context]) → object
```

У метод [`Matreshka#onDebounce`](/ua/api/matreshka/on-debounce/) можна передати об'єкт з парами подія-обробник, щоб уникнути багаторазового виклику методу і скоротити код.

**Повертає:** [`object`](/ua/api/types/object/) – self

### Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `evtnameHandlerObject` |  | [`object`](/ua/api/types/object/) | Об'єкт з обробниками подій |
| `debounceDelay` (необов'язковий) | `0` | [`number`](/ua/api/types/number/) | Затримка |
| `triggerOnInit` (необов'язковий) | `false` | [`boolean`](/ua/api/types/boolean/) | Якщо аргумент ``triggerOnInit`` дорівнює ``true``, то обробники будуть викликаний негайно після ініціалізації |
| `context` (необов'язковий) |  | [`object`](/ua/api/types/object/) | Контекст обробників |

### Посилання

- [`Matreshka#on(2)`](/ua/api/matreshka/on/#variation-2)

### Приклади

```js
this.onDebounce({
	'custom': evt => { ... },
	'click::x': evt => { ... },
	'change:y': evt => { ... }
});
```
