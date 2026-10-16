---
title: "Matreshka.binders.output"
sidebarTitle: "output"
description: "Matreshka.binders.output: Возвращает байндер, связывающий свойство объекта с элементом output. Напрямую байндер использовать не обязательно, так как он входит…"
importance: 3
---

# Matreshka.binders.output

**Метод** · Начиная с версии 1.4

**Импорт:**

```js
import { binders } from 'matreshka';

const { output } = binders;
// или
import { binders } from 'matreshka';

const { output } = binders;
```

```js
Matreshka.binders.output() → binder
```

Возвращает байндер, связывающий свойство объекта с элементом ``output``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).

``undefined`` и ``null`` отображаются как пустая строка.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Примеры

```js
this.bindNode('myKey', '.my-output', Matreshka.binders.output());
```
