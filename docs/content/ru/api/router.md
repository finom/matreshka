---
title: "Matreshka.Router"
description: "Matreshka.Router: Класс, на котором построен initRouter, со свойствами path, hashPath и parts"
importance: 3
---

# Matreshka.Router

**Класс**

**Импорт:**

```js
import { Router } from 'matreshka/router';
```

[`Matreshka.initRouter`](/ru/api/matreshka-static/init-router/) построен на классе ``Matreshka.Router``. Он принимает единственный аргумент - тип роутера (``"hash"``, ``"history"`` или произвольная строка).

По умолчанию библиотека создает два экземпляра ``Matreshka.Router`` с типами ``hash`` и ``history``. Они находятся в ``Matreshka.Router.hash`` и ``Matreshka.Router.history``. Роутер инициализируется лениво, поэтому, если просто подключить скрипт к странице, библиотека ничего не делает.

Для этих двух экземпляров используется паттерн «одиночка». Это значит, что при попытке создать еще один экземпляр типа ``hash`` через ``new Matreshka.Router('hash')`` вместо нового экземпляра вернется ``Matreshka.Router.hash``. Так вся работа с URL собрана в одном месте, это хорошо для производительности и исключает коллизии. Объекты, переданные в ``initRouter``, просто подписываются на изменения роутера нужного типа.

Свои экземпляры (не hash и не history) ``Matreshka.Router`` можно создать вручную, если нужно сгенерировать URL для дальнейшего использования. В этом случае изменения свойств не трогают ``hash`` и не вызывают ``pushState``.

#### Свойства

У экземпляров ``Matreshka.Router`` есть 3 свойства.

- ``path`` - актуальный URL, например ``/foo/bar/baz/``.
- ``hashPath`` - актуальный URL с префиксом hashbang, например ``#!/foo/bar/baz/``
- ``parts`` - массив всех частей пути, например ``['foo', 'bar', 'baz']``.

Все эти свойства созданы с помощью [`Matreshka#calc`](/ru/api/matreshka/calc/), то есть при изменении одного свойства остальные меняются автоматически.

```js
Matreshka.Router.hash.path = '/foo/bar/baz/';
```

Меняя эти свойства, можно запускать нужные процедуры (обновить путь, изменить подписанные объекты и т. д.)

#### Методы

- ``subscribe(object, route)`` - подписывает объект на изменения маршрута.
- ``init()`` - используется для ленивой инициализации в методе ``subscribe`` (вызывать вручную не нужно).

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `type` | [`string`](/ru/api/types/string/) | ``"hash"``, ``"history"`` или произвольная строка |

## Примеры

```js
const customRouter = new Matreshka.Router('myType');
const object = {
	a: 'foo',
	b: 'bar'
};

customRouter.subscribe(object, '/a/b/');

console.log(customRouter.path); // /foo/bar/
```
