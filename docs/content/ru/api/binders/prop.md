---
title: "Matreshka.binders.prop"
sidebarTitle: "prop"
description: "Matreshka.binders.prop: Возвращает байндер, меняющий свойство DOM элемента на значение свойства объекта"
importance: 2
---

# Matreshka.binders.prop

**Метод** · Начиная с версии 0.3

**Импорт:**

```js
import prop from 'matreshka/binders/prop';
// или
import { prop } from 'matreshka/binders';
```

```js
Matreshka.binders.prop(property, [mappingFn]) → binder
```

Возвращает байндер, меняющий свойство DOM элемента на значение свойства объекта

Значение свойства можно преобразить с помощью переданной функции ``mappingFn``.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `property` | [`string`](/ru/api/types/string/) | Имя свойства |
| `mappingFn` (необязательный) | [`function`](/ru/api/types/function/) | Отображающая функция |

## Примеры

```js
this.bindNode('disabled', '.my-button',
    Matreshka.binders.prop('disabled'));

// устанавливает свойство disabled = true для элемента
this.disabled = true;

// устанавливает свойство disabled = false для элемента
this.disabled = false;
```

**Использование отображающей функции**

```js
this.bindNode('myProp', '.my-node'
    Matreshka.binders.prop('foo', value => `Hello, ${value}`));

this.myProp = 'World'; // свойство елемента foo имеет значение "Hello, World"
```
