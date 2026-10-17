---
title: "Matreshka.parseForm"
sidebarTitle: "parseForm"
description: "Matreshka.parseForm: Привязывает именованные поля HTML формы к соответствующим свойствам"
importance: 2
---

# Matreshka.parseForm

**Метод**

**Импорт:**

```js
import { parseForm } from 'matreshka/parse-form';
```

```js
Matreshka.parseForm(object, form, [callback], [eventOptions]) → node|null
```

Функция привязывает именованные поля HTML формы (input, select, textarea и т. д.) к соответствующим свойствам.

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
object.x = 'bar'; // меняет значение поля на 'bar'
```

Третий аргумент полезен, когда ``parseForm`` используется с [`Matreshka.Object`](/ru/api/matreshka-object/): в нем можно вызвать метод [`Matreshka.Object#addDataKeys`](/ru/api/matreshka-object/add-data-keys/).

```js
const form = parseForm(this, ':sandbox .foo', key => this.addDataKeys(key), {
    getValueOnBind: false
});
```

> На странице с бандлом, подключенным тегом script, функция доступна как ``Matreshka.parseForm``.

**Возвращает:** [`node`](/ru/api/types/node/) \| [`null`](/ru/api/types/null/) – Элемент формы или ``null``, если форма не найдена

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `object` | [`object`](/ru/api/types/object/) | Объект |
| `form` | [`string`](/ru/api/types/string/) \| [`node`](/ru/api/types/node/) \| [`$nodes`](/ru/api/types/dollar-nodes/) | Селектор, DOM узел и т. п. формы (кастомные селекторы ``:sandbox`` и ``:bound(KEY)`` тоже подходят) |
| `callback` (необязательный) | [`function`](/ru/api/types/function/) | Функция, которая вызывается для каждого найденного поля; получает имя поля и сам элемент |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Опции события, которые передаются в каждый внутренний вызов [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) |

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [Пример парсера форм](/examples/parse-form/)
