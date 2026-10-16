---
title: "Matreshka.binders.html"
sidebarTitle: "html"
description: "Matreshka.binders.html: Возвращает байндер, меняющий innerHTML DOM элемента в зависимости от значения свойства объекта"
importance: 2
---

# Matreshka.binders.html

**Метод** · Начиная с версии 0.1

**Импорт:**

```js
import { binders } from 'matreshka';

const { html } = binders;
// или
import { binders } from 'matreshka';

const { html } = binders;
```

```js
Matreshka.binders.html([mappingFn]) → binder
```

Возвращает байндер, меняющий ``innerHTML`` DOM элемента в зависимости от значения свойства объекта

Значение свойства можно преобразить с помощью переданной функции ``mappingFn``.

``undefined`` и ``null`` отображаются как пустая строка.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `mappingFn` (необязательный) | [`function`](/ru/api/types/function/) | Отображающая функция |

## Примеры

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.html());
// установит innerHTML элемента как "<div>foo</div>"
this.myKey = '<div>foo</div>';
```

**Использование отображающей функции**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.html(value => `Hello, ${value}`));

// установит innerHTML элемента как "Hello, <div>foo</div>"
this.myKey = '<div>foo</div>';
```
