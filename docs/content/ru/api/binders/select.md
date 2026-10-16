---
title: "Matreshka.binders.select"
sidebarTitle: "select"
description: "Matreshka.binders.select: Возвращает байндер, связывающий свойство объекта с элементом select. Напрямую байндер использовать не обязательно, так как он входит…"
importance: 3
---

# Matreshka.binders.select

**Метод** · Начиная с версии 0.3

**Импорт:**

```js
import { binders } from 'matreshka';
// binders.select === Matreshka.binders.select
```

```js
Matreshka.binders.select([multiple=false]) → binder
```

Возвращает байндер, связывающий свойство объекта с элементом ``select``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).

``undefined`` и ``null`` выбирают опцию без значения, если она есть. Если ``multiple`` равен ``true``, свойство может быть массивом значений, одним значением или ``null`` (ничего не выбрано); значения сравниваются как строки, поэтому числа тоже работают.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `multiple` (необязательный) | `false` | [`boolean`](/ru/api/types/boolean/) | Является ли селект ``multiple`` |

## Примеры

```js
this.bindNode('myKey', '.my-select', Matreshka.binders.select(true));
```
