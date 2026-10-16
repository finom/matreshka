---
title: "Matreshka.binders.existence"
sidebarTitle: "existence"
description: "Matreshka.binders.existence: Возвращает байндер для одностороннего связывания, переключающий наличие элемента в DOM дереве, в зависимости от значения свойства…"
importance: 2
---

# Matreshka.binders.existence

**Метод** · Начиная с версии 2.3

**Импорт:**

```js
import { binders } from 'matreshka';

const { existence } = binders;
// или
import { binders } from 'matreshka';

const { existence } = binders;
```

```js
Matreshka.binders.existence([bool=true]) → binder
```

Возвращает байндер для одностороннего связывания, переключающий наличие элемента в DOM дереве, в зависимости от значения свойства объекта

Байндер работает так же, как и [`Matreshka.binders.display`](/ru/api/binders/display/), но вместо изменения видимости элемента, изменяется наличие элемента на странице. Байндер полезен для:

- Крупных приложений: в зависимости от состояния роутера показать ту или иную страницу;
- Для реализации бесконечного скроллинга;
- Для других задач, где нужно спрятать элемент, но его наличие в DOM дереве не обязательно.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `bool` (необязательный) | `true` | [`boolean`](/ru/api/types/boolean/) | Если аргумент равен ``true``, то элемент исчезает при ложном значении свойства, если равен ``false``, исчезает при правдивом значении |

## Примеры

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(true));
```

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(false));
```
