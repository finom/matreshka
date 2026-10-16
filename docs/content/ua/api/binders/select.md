---
title: "Matreshka.binders.select"
sidebarTitle: "select"
description: "Matreshka.binders.select: Повертає байндер, що зв'язує властивість об'єкта з елементом select. Безпосередньо байндер використовувати не обов'язково, так як…"
importance: 3
---

# Matreshka.binders.select

**Метод** · Починаючи з версії 0.3

**Імпорт:**

```js
import { binders } from 'matreshka';

const { select } = binders;
```

```js
Matreshka.binders.select([multiple=false]) → binder
```

Повертає байндер, що зв'язує властивість об'єкта з елементом ``select``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).

``undefined`` і ``null`` вибирають опцію без значення, якщо вона є. Якщо ``multiple`` дорівнює ``true``, властивість може бути масивом значень, одним значенням або ``null`` (нічого не вибрано); значення порівнюються як рядки, тому числа теж працюють.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `multiple` (необов'язковий) | `false` | [`boolean`](/ua/api/types/boolean/) | Чи є селект ``multiple`` |

## Приклади

```js
this.bindNode('myKey', '.my-select', Matreshka.binders.select(true));
```
