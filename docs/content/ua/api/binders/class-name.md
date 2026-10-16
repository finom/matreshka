---
title: "Matreshka.binders.className"
sidebarTitle: "className"
description: "Matreshka.binders.className: Повертає байндер, який перемикає ім'я класу DOM елемента в залежності від значення властивості об'єкта. Якщо значення властивості…"
importance: 2
---

# Matreshka.binders.className

**Метод**

**Імпорт:**

```js
import { binders } from 'matreshka';

const { className } = binders;
```

```js
Matreshka.binders.className(className, [bool=true]) → binder
```

Повертає байндер, який перемикає ім'я класу DOM елемента в залежності від значення властивості об'єкта. Якщо значення властивості нестрого дорівнює ``true``, ім'я класу додається, в іншому випадку - забирається. Логіку можна змінити, передавши ``false`` другим аргументом, і, таким чином, ім'я класу буде додаватися, коли значення властивості нестрого дорівнює ``false`` і навпаки.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `className` |  | [`string`](/ua/api/types/string/) |  |
| `bool` (необов'язковий) | `true` | [`boolean`](/ua/api/types/boolean/) |  |

## Приклади

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('blah'));

this.myKey = true; // додає клас 'blah'

this.myKey = false; // вбирає клас 'blah'
```

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('blah', false));

this.myKey = false; // додає клас 'blah'

this.myKey = true; // вбирає клас 'blah'
```
