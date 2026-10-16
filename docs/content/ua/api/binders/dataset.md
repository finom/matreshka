---
title: "Matreshka.binders.dataset"
sidebarTitle: "dataset"
description: "Matreshka.binders.dataset: Повертає байндер, який змінює властивість dataset DOM элемента в залежності від значення властивості об'єкта."
importance: 2
---

# Matreshka.binders.dataset

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import dataset from 'matreshka/binders/dataset';
// або
import { dataset } from 'matreshka/binders';
```

```js
Matreshka.binders.dataset(property, [mappingFn]) → binder
```

Повертає байндер, який змінює властивість [dataset](https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset) DOM элемента в залежності від значення властивості об'єкта.

Значення властивості можна перетворити за допомогою переданої функції ``mappingFn``.

``undefined`` і ``null`` показуються як порожній рядок.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `property` | [`string`](/ua/api/types/string/) | Властивість dataset |
| `mappingFn` (необов'язковий) | [`function`](/ua/api/types/function/) | Відображаюча функція |

## Приклади

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.dataset('myProp'));
this.myKey = 'foo';
```

**Використання ``mappingFn``**

```js
this.bindNode('myKey', '.my-element',
    Matreshka.binders.dataset('myProp', value => `Hello, ${value}`));

this.myKey = 'foo'; // атрибут data-my-prop має значення "Hello, foo"
```
