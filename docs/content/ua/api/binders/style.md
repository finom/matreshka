---
title: "Matreshka.binders.style"
sidebarTitle: "style"
description: "Matreshka.binders.style: Повертає байндер, який змінює задану властивість стилю DOM елемента в залежності від значення властивості об'єкта"
importance: 2
---

# Matreshka.binders.style

**Метод**

**Імпорт:**

```js
import { binders } from 'matreshka';

const { style } = binders;
```

```js
Matreshka.binders.style(property, [mappingFn]) → binder
```

Повертає байндер, який змінює задану властивість стилю DOM елемента в залежності від значення властивості об'єкта

Значення властивості можна перетворити за допомогою переданої функції ``mappingFn``.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `property` | [`string`](/ua/api/types/string/) | Властивість ``style`` (camel-cased) |
| `mappingFn` (необов'язковий) | [`function`](/ua/api/types/function/) | Відображаюча функція |

## Приклади

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.style('backgroundColor'));
this.myKey = 'red'; // колір фону .my-element став червоним
```

**Використання ``mappingFn``**

```js
this.bindNode('myKey', '.my-element',
  Matreshka.binders.style('backgroundImage', value => `url("${value}")`));

this.myKey = 'cats.jpg'; // backgroundImage дорівнює "url("cats.jpg")"
```
