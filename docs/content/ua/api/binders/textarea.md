---
title: "Matreshka.binders.textarea"
sidebarTitle: "textarea"
description: "Matreshka.binders.textarea: Повертає байндер, що зв'язує властивість об'єкта з елементом textarea. Безпосередньо байндер використовувати не обов'язково, так…"
importance: 3
---

# Matreshka.binders.textarea

**Метод**

**Імпорт:**

```js
import { binders } from 'matreshka';

const { textarea } = binders;
```

```js
Matreshka.binders.textarea() → binder
```

Повертає байндер, що зв'язує властивість об'єкта з елементом ``textarea``. Безпосередньо байндер використовувати не обов'язково, так як він входить в список [`Matreshka.defaultBinders`](/ua/api/matreshka-static/default-binders/).

**Повертає:** [`binder`](/ua/api/types/binder/)

## Приклади

```js
this.bindNode('myKey', '.my-textarea', Matreshka.binders.textarea());
```
