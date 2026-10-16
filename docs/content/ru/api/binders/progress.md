---
title: "Matreshka.binders.progress"
sidebarTitle: "progress"
description: "Matreshka.binders.progress: Возвращает байндер, связывающий свойство объекта с элементом progress. Напрямую байндер использовать не обязательно, так как он…"
importance: 3
---

# Matreshka.binders.progress

**Метод**

**Импорт:**

```js
import { binders } from 'matreshka';

const { progress } = binders;
```

```js
Matreshka.binders.progress() → binder
```

Возвращает байндер, связывающий свойство объекта с элементом ``progress``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Примеры

```js
this.bindNode('myKey', '.my-progress', Matreshka.binders.progress());
```
