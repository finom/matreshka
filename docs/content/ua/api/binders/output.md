---
title: "Matreshka.binders.output"
sidebarTitle: "output"
description: "Matreshka.binders.output: Повертає байндер, що зв'язує властивість об'єкта з елементом output. Безпосередньо байндер використовувати не обов'язково, так як…"
importance: 3
---

# Matreshka.binders.output

**Метод** · Починаючи з версії 1.4

**Імпорт:**

```js
import output from 'matreshka/binders/output';
// або
import { output } from 'matreshka/binders';
```

```js
Matreshka.binders.output() → binder
```

Повертає байндер, що зв'язує властивість об'єкта з елементом ``output``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).

``undefined`` і ``null`` показуються як порожній рядок.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Приклади

```js
this.bindNode('myKey', '.my-output', Matreshka.binders.output());
```
