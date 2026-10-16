---
title: "Matreshka.binders.input"
sidebarTitle: "input"
description: "Matreshka.binders.input: Повертає байндер, що зв'язує властивість об'єкта з елементом input. Безпосередньо байндер використовувати не обов'язково, так як він…"
importance: 3
---

# Matreshka.binders.input

**Метод** · Починаючи з версії 0.3

**Імпорт:**

```js
import { binders } from 'matreshka';

const { input } = binders;
```

```js
Matreshka.binders.input([type]) → binder
```

Повертає байндер, що зв'язує властивість об'єкта з елементом ``input``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).

Для текстових полів ``undefined`` і ``null`` показуються як порожній рядок. Для ``radio``: позначений перемикач встановлює властивості своє ``value``; знятий перемикач властивість не змінює.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `type` (необов'язковий) | [`string`](/ua/api/types/string/) | Тип інпута |

## Приклади

```js
this.bindNode('myKey', '.my-input', Matreshka.binders.input('range'));
```
