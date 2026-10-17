---
title: "Matreshka.Router"
description: "Matreshka.Router: Клас, на якому побудований initRouter, з властивостями path, hashPath і parts"
importance: 3
---

# Matreshka.Router

**Клас**

**Імпорт:**

```js
import { Router } from 'matreshka/router';
```

[`Matreshka.initRouter`](/ua/api/matreshka-static/init-router/) побудований на класі ``Matreshka.Router``. Він приймає єдиний аргумент - тип роутера (``"hash"``, ``"history"`` або довільний рядок).

За замовчуванням бібліотека створює два екземпляри ``Matreshka.Router`` з типами ``hash`` і ``history``. Вони знаходяться в ``Matreshka.Router.hash`` і ``Matreshka.Router.history``. Роутер ініціалізується ліниво, тому, якщо просто підключити скрипт до сторінки, бібліотека нічого не робить.

Для цих двох екземплярів використовується патерн «одинак». Це означає, що при спробі створити ще один екземпляр типу ``hash`` через ``new Matreshka.Router('hash')`` замість нового екземпляра повернеться ``Matreshka.Router.hash``. Так уся робота з URL зібрана в одному місці, це добре для продуктивності і виключає колізії. Об'єкти, передані в ``initRouter``, просто підписуються на зміни роутера потрібного типу.

Власні екземпляри (не hash і не history) ``Matreshka.Router`` можна створити вручну, якщо потрібно згенерувати URL для подальшого використання. У цьому випадку зміни властивостей не чіпають ``hash`` і не викликають ``pushState``.

#### Властивості

Екземпляри ``Matreshka.Router`` мають 3 властивості.

- ``path`` - актуальний URL, наприклад ``/foo/bar/baz/``.
- ``hashPath`` - актуальний URL з префіксом hashbang, наприклад ``#!/foo/bar/baz/``
- ``parts`` - масив усіх частин шляху, наприклад ``['foo', 'bar', 'baz']``.

Усі ці властивості створені за допомогою [`Matreshka#calc`](/ua/api/matreshka/calc/), тобто при зміні однієї властивості інші змінюються автоматично.

```js
Matreshka.Router.hash.path = '/foo/bar/baz/';
```

Змінюючи ці властивості, можна запускати потрібні процедури (оновити шлях, змінити підписані об'єкти тощо)

#### Методи

- ``subscribe(object, route)`` - підписує об'єкт на зміни маршруту.
- ``init()`` - використовується для лінивої ініціалізації в методі ``subscribe`` (викликати вручну не потрібно).

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `type` | [`string`](/ua/api/types/string/) | ``"hash"``, ``"history"`` або довільний рядок |

## Приклади

```js
const customRouter = new Matreshka.Router('myType');
const object = {
	a: 'foo',
	b: 'bar'
};

customRouter.subscribe(object, '/a/b/');

console.log(customRouter.path); // /foo/bar/
```
