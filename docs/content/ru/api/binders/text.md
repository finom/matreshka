---
title: "Matreshka.binders.text"
sidebarTitle: "text"
description: "Matreshka.binders.text: Возвращает байндер, меняющий textContent (текстовое содержимое) DOM элемента в зависимости от значения свойства объекта."
importance: 2
---

# Matreshka.binders.text

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import { binders } from 'matreshka';
// binders.text === Matreshka.binders.text
```

```js
Matreshka.binders.text([mappingFn]) → binder
```

Возвращает байндер, меняющий ``textContent`` (текстовое содержимое) DOM элемента в зависимости от значения свойства объекта.

``Matreshka.binders.text`` позволяет вывести содержимое свойства как есть. Значение свойства можно преобразить с помощью переданной функции ``mappingFn``.

``undefined`` и ``null`` отображаются как пустая строка.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `mappingFn` (необязательный) | [`function`](/ru/api/types/function/) | Отображающая функция |

## Примеры

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.text());
this.myKey = 'foo'; // установит textContent элемента как "foo"
```

**Использование отображающей функции**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.text(value => `Hello, ${value}`));

this.myKey = 'foo'; // установит textContent элемента как "Hello, foo"
```
