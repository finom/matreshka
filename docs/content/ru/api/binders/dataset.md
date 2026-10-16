---
title: "Matreshka.binders.dataset"
sidebarTitle: "dataset"
description: "Matreshka.binders.dataset: Возвращает байндер, меняющий заданное свойство объекта dataset DOM элемента в зависимости от значения свойства объекта."
importance: 2
---

# Matreshka.binders.dataset

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import dataset from 'matreshka/binders/dataset';
// или
import { dataset } from 'matreshka/binders';
```

```js
Matreshka.binders.dataset(property, [mappingFn]) → binder
```

Возвращает байндер, меняющий заданное свойство объекта [dataset](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset) DOM элемента в зависимости от значения свойства объекта.

Значение свойства можно преобразить с помощью переданной функции ``mappingFn``.

``undefined`` и ``null`` отображаются как пустая строка.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `property` | [`string`](/ru/api/types/string/) | Свойство dataset |
| `mappingFn` (необязательный) | [`function`](/ru/api/types/function/) | Отображающая функция |

## Примеры

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.dataset('myProp'));
this.myKey = 'foo';
```

**Использование отображающей функции**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.dataset('myProp', value => `Hello, ${value}`));

this.myKey = 'foo'; // атрибут data-my-prop имеет значение "Hello, foo"
```
