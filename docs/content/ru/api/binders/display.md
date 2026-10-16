---
title: "Matreshka.binders.display"
sidebarTitle: "display"
description: "Matreshka.binders.display: Возвращает байндер для одностороннего связывания, меняющий видимость DOM элемента (используя style.display), в зависимости от…"
importance: 2
---

# Matreshka.binders.display

**Метод** · Начиная с версии 0.1

**Импорт:**

```js
import { binders } from 'matreshka';

const { display } = binders;
```

```js
Matreshka.binders.display([bool=true]) → binder
```

Возвращает байндер для одностороннего связывания, меняющий видимость DOM элемента (используя ``style.display``), в зависимости от значения свойства объекта

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `bool` (необязательный) | `true` | [`boolean`](/ru/api/types/boolean/) | Если аргумент равен ``true``, то элемент прячется при ложном значении свойства, если равен ``false``, прячется при правдивом значении |

## Примеры

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.display(true));
```

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.display(false));
```
