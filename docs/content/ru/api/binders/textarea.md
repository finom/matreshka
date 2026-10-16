---
title: "Matreshka.binders.textarea"
sidebarTitle: "textarea"
description: "Matreshka.binders.textarea: Возвращает байндер, связывающий свойство объекта с элементом textarea. Напрямую байндер использовать не обязательно, так как он…"
importance: 3
---

# Matreshka.binders.textarea

**Метод** · Начиная с версии 0.3

**Импорт:**

```js
import textarea from 'matreshka/binders/textarea';
// или
import { textarea } from 'matreshka/binders';
```

```js
Matreshka.binders.textarea() → binder
```

Возвращает байндер, связывающий свойство объекта с элементом ``textarea``. Напрямую байндер использовать не обязательно, так как он входит в список [`Matreshka.defaultBinders`](/ru/api/matreshka-static/default-binders/).

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Примеры

```js
this.bindNode('myKey', '.my-textarea', Matreshka.binders.textarea());
```
