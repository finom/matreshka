---
title: "Matreshka.binders.progress"
sidebarTitle: "progress"
description: "Matreshka.binders.progress: Повертає байндер, що зв'язує властивість об'єкта з елементом progress. Безпосередньо байндер використовувати не обов'язково, так…"
importance: 3
---

# Matreshka.binders.progress

**Метод** · Починаючи з версії 1.1

**Імпорт:**

```js
import progress from 'matreshka/binders/progress';
// або
import { progress } from 'matreshka/binders';
```

```js
Matreshka.binders.progress() → binder
```

Повертає байндер, що зв'язує властивість об'єкта з елементом ``progress``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).

**Повертає:** [`binder`](/ua/api/types/binder/)

## Приклади

```js
this.bindNode('myKey', '.my-progress', Matreshka.binders.progress());
```
