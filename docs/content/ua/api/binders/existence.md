---
title: "Matreshka.binders.existence"
sidebarTitle: "existence"
description: "Matreshka.binders.existence: Повертає байндер для одностороннього зв'язування, що перемикає наявність елемента в DOM дереві, в залежності від значення…"
importance: 2
---

# Matreshka.binders.existence

**Метод** · Починаючи з версії 2.3

**Імпорт:**

```js
import existence from 'matreshka/binders/existence';
// або
import { existence } from 'matreshka/binders';
```

```js
Matreshka.binders.existence([bool=true]) → binder
```

Повертає байндер для одностороннього зв'язування, що перемикає наявність елемента в DOM дереві, в залежності від значення властивості об'єкта

Байндер працює так само, як і [`Matreshka.binders.display`](/ua/api/binders/display/), але замість зміни видимості елемента, змінюється наявність елемента на сторінці. Байндер може бути корисним:

- Для великих додатків: в залежності від стану роутера показати ту чи іншу сторінку;
- Для реалізації нескінченного скролінгу;
- Для інших тасків, де потрібно сховати елемент, але його наявність в DOM дереві не є обов'язковою.

**Повертає:** [`binder`](/ua/api/types/binder/)

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `bool` (необов'язковий) | `true` | [`boolean`](/ua/api/types/boolean/) | Якщо аргумент дорівнює ``true``, то елемент зникає при неправдивому значенні властивості, якщо дорівнює ``false``, зникає при правдивому значенні |

## Приклади

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(true));
```

```js
this.bindNode('myKey', '.my-element', Matreshka.binders.existence(false));
```
