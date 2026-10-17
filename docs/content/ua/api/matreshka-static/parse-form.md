---
title: "Matreshka.parseForm"
sidebarTitle: "parseForm"
description: "Matreshka.parseForm: Прив'язує іменовані поля HTML форми до відповідних властивостей"
importance: 2
---

# Matreshka.parseForm

**Метод**

**Імпорт:**

```js
import { parseForm } from 'matreshka/parse-form';
```

```js
Matreshka.parseForm(object, form, [callback], [eventOptions]) → node|null
```

Функція прив'язує іменовані поля HTML форми (input, select, textarea тощо) до відповідних властивостей.

```html
<form class="my-form">
    <input type="text" value="foo" name="x">
</form>
```

```js
const object = {};
parseForm(object, '.my-form');

// ...
console.log(object.x); // 'foo'
object.x = 'bar'; // змінює значення поля на 'bar'
```

Третій аргумент корисний, коли ``parseForm`` використовується з [`Matreshka.Object`](/ua/api/matreshka-object/): у ньому можна викликати метод [`Matreshka.Object#addDataKeys`](/ua/api/matreshka-object/add-data-keys/).

```js
const form = parseForm(this, ':sandbox .foo', key => this.addDataKeys(key), {
    getValueOnBind: false
});
```

> На сторінці з бандлом, підключеним тегом script, функція доступна як ``Matreshka.parseForm``.

**Повертає:** [`node`](/ua/api/types/node/) \| [`null`](/ua/api/types/null/) – Елемент форми або ``null``, якщо форму не знайдено

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `object` | [`object`](/ua/api/types/object/) | Об'єкт |
| `form` | [`string`](/ua/api/types/string/) \| [`node`](/ua/api/types/node/) \| [`$nodes`](/ua/api/types/dollar-nodes/) | Селектор, DOM вузол тощо форми (кастомні селектори ``:sandbox`` і ``:bound(KEY)`` теж підходять) |
| `callback` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка викликається для кожного знайденого поля; отримує ім'я поля і сам елемент |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Опції події, які передаються в кожен внутрішній виклик [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) |

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [Приклад парсера форм](/examples/parse-form/)
