---
title: "Matreshka.binders.input"
sidebarTitle: "input"
description: "Matreshka.binders.input: Возвращает байндер, связывающий свойство объекта с элементом input. Напрямую байндер использовать не обязательно, так как он входит в…"
importance: 3
---

# Matreshka.binders.input

**Метод** · Начиная с версии 0.3

**Импорт:**

```js
import input from 'matreshka/binders/input';
// или
import { input } from 'matreshka/binders';
```

```js
Matreshka.binders.input([type]) → binder
```

Возвращает байндер, связывающий свойство объекта с элементом ``input``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).

Для текстовых полей ``undefined`` и ``null`` отображаются как пустая строка. Для ``radio``: отмеченный переключатель устанавливает свойству своё ``value``; снятый переключатель свойство не меняет.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `type` (необязательный) | [`string`](/ru/api/types/string/) | Тип инпута |

## Примеры

```js
this.bindNode('myKey', '.my-input', Matreshka.binders.input('range'));
```
