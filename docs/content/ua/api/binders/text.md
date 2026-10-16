---
title: "Matreshka.binders.text"
sidebarTitle: "text"
description: "Matreshka.binders.text: Повертає байндер, який змінює textContent (текстовий вміст) DOM елемента в залежності від значення властивості об'єкта."
importance: 2
---

# Matreshka.binders.text

**Метод**

**Імпорт:**

```js
import { binders } from 'matreshka';

const { text } = binders;
```

```js
Matreshka.binders.text([mappingFn]) → binder
```

Повертає байндер, який змінює ``textContent`` (текстовий вміст) DOM елемента в залежності від значення властивості об'єкта.

``Matreshka.binders.text`` дозволяє вивести вміст властивості як є. Значення властивості можна перетворити за допомогою переданої функції ``mappingFn``.

``undefined`` і ``null`` показуються як порожній рядок.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `mappingFn` (необов'язковий) | [`function`](/ua/api/types/function/) | Відображаюча функція |

## Приклади

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.text());
this.myKey = 'foo'; // встановить textContent элемента як "foo"
```

**Використання ``mappingFn``**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.text(value => `Hello, ${value}`));

this.myKey = 'foo'; // встановить textContent элемента як "Hello, foo"
```
