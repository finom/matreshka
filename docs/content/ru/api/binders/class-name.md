---
title: "Matreshka.binders.className"
sidebarTitle: "className"
description: "Matreshka.binders.className: Возвращает байндер, который переключает имя класса DOM элемента в зависимости от значения свойства объекта. Если значение…"
importance: 2
---

# Matreshka.binders.className

**Метод** · Начиная с версии 0.1

**Импорт:**

```js
import { binders } from 'matreshka';

const { className } = binders;
// или
import { binders } from 'matreshka';

const { className } = binders;
```

```js
Matreshka.binders.className(className, [bool=true]) → binder
```

Возвращает байндер, который переключает имя класса DOM элемента в зависимости от значения свойства объекта. Если значение свойства нестрого равно ``true``, имя класса добавляется, в противном случае - убирается. Логику можно изменить, передав ``false`` вторым аргументом, и, таким образом, имя класса будет добавляться, когда значение свойства нестрого равно ``false`` и наоборот.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `className` |  | [`string`](/ru/api/types/string/) |  |
| `bool` (необязательный) | `true` | [`boolean`](/ru/api/types/boolean/) |  |

## Примеры

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('blah'));

this.myKey = true; // добавляет класс 'blah'

this.myKey = false; // убирает класс 'blah'
```

```js
this.bindNode('myKey', '.my-element',
        Matreshka.binders.className('blah', false));

this.myKey = false; // добавляет класс 'blah'

this.myKey = true; // убирает класс 'blah'
```
