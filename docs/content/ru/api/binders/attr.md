---
title: "Matreshka.binders.attr"
sidebarTitle: "attr"
description: "Matreshka.binders.attr: Возвращает байндер, меняющий атрибут DOM элемента на значение свойства объекта"
importance: 2
---

# Matreshka.binders.attr

**Метод** · Начиная с версии 0.3

**Импорт:**

```js
import { binders } from 'matreshka';

const { attr } = binders;
// или
import { binders } from 'matreshka';

const { attr } = binders;
```

```js
Matreshka.binders.attr(attribute, [mappingFn]) → binder
```

Возвращает байндер, меняющий атрибут DOM элемента на значение свойства объекта

Значение свойства можно преобразить с помощью переданной функции ``mappingFn``.

``undefined`` и ``null`` устанавливают пустой атрибут; атрибут не удаляется.

**Возвращает:** [`binder`](/ru/api/types/binder/)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `attribute` | [`string`](/ru/api/types/string/) | Имя атрибута |
| `mappingFn` (необязательный) | [`function`](/ru/api/types/function/) | Отображающая функция |

## Примеры

```js
this.bindNode('image', 'img.my-image', Matreshka.binders.attr('src'));

this.image = 'http://example.com/cats.jpg';
```

**Использование отображающей функции**

```js
this.bindNode('myKey', '.my-node',
    Matreshka.binders.attr('foo', value => `Hello, ${value}`));

this.myKey = 'World'; // атрибут foo имеет значение "Hello, World"
```
