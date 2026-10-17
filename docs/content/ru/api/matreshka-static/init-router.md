---
title: "Matreshka.initRouter"
sidebarTitle: "initRouter"
description: "Matreshka.initRouter: Включает двустороннее связывание данных между свойствами и частями URL (хеш по умолчанию или History API)"
importance: 2
---

# Matreshka.initRouter

**Метод**

**Импорт:**

```js
import { initRouter } from 'matreshka/router';
```

```js
Matreshka.initRouter(object, route, [type="hash"]) → object
```

Включает двустороннее связывание данных между свойствами и частями URL

По умолчанию роутер работает с хешем: он использует ``location.hash`` с hashbang (``#!/a/b/``). Чтобы вместо этого использовать путь (``/a/b/``) через History API, передайте ``"history"`` третьим аргументом.

```js
// используется location.hash
initRouter(object, '/a/b/c/');
object.a = 'foo';
object.b = 'bar';
object.c = 'baz';

// location.hash становится #!/foo/bar/baz/
```

Если нужно использовать History API вместо хеша, передайте ``"history"`` третьим аргументом.

```js
initRouter(object, '/a/b/c/', 'history');
```

Как работает «традиционный» роутинг? Разработчик задает правило (маршрут) и функцию, которая вызывается, когда текущий путь подходит под правило.

```js
route("books/:id", id => {
	// что-то делаем
});
```

Принцип ``initRouter`` другой. Вы указываете, какая часть URL (поддерживаются и [хеш](https://developer.mozilla.org/ru/docs/Web/API/Location/hash), и [HTML5 History](https://developer.mozilla.org/ru/docs/Web/API/History_API)) синхронизируется с каким свойством.

Скажем, нужно синхронизировать ``"x"`` с первой частью ``location.hash``, а ``"y"`` со второй.

```js
initRouter(object, '/x/y/');
```

Теперь, когда вы пишете...

```js
object.x = 'foo';
object.y = 'bar';
```

...``location.hash`` автоматически меняется на ``#!/foo/bar/``

И наоборот. Когда URL меняется вручную или кнопками «назад» и «вперед», свойства меняются автоматически.

```js
location.hash = '#!/baz/qux/';

// ... через мгновение
console.log(object.x, object.y); // 'baz', 'qux'
```

Как обычно, изменения свойств можно слушать методом [`Matreshka#on`](/ru/api/matreshka/on/).

```js
Matreshka.on(object, 'change:x', handler);
// для экземпляров Matreshka: this.on('change:x', handler);
```

Значения кодируются в URL и декодируются обратно: ``object.x = 'a b/c'`` дает ``#!/a%20b%2Fc/``, а ``object.x`` остается ``'a b/c'``. Хеш, который не начинается с ``#!`` (якорь вроде ``#top``), не является маршрутом.

#### Синтаксис звездочки

Если какую-то часть пути не нужно синхронизировать со свойством, поставьте на ее место звездочку.

```js
initRouter(object, '/x/*/y');
```

Если хеш выглядит как ``#!/foo/bar/baz/``, то ``object.x = "foo"``, а ``object.y = "baz"``.

Это удобно, когда разные классы управляют разными частями пути.

**class1.js**

```js
initRouter(this, '/x/*/');
```

**class2.js**

```js
initRouter(this, '/*/y/');
```

#### Две вещи, которые нужно запомнить

**1.** Если у свойства есть значение (не ``undefined``, ``null`` и не ``''``), URL меняется сразу после вызова ``initRouter``. Свойство без значения получает значение из URL.

```js
object.x = 'foo';

initRouter(object, '/x/y/');
```

**2.** Если свойство получает ``null``, ``undefined`` или ``''``, все следующие за ним свойства получают ``null``.

```js
initRouter(object, '/x/y/z/u/');

object.y = null; // object.z и object.u тоже становятся null
```

Идея в том, чтобы свойства отражали актуальное состояние URL. Было бы странно получить ``"z"`` со значением ``"foo"``, когда соответствующей части URL нет.

#### HTML5 History API

Роутер поддерживает и HTML5 History. Для этого передайте функции ``initRouter`` необязательный аргумент ``type`` со значением ``"history"`` (по умолчанию ``type`` равен ``"hash"``).

```js
initRouter(object, '/x/y/z/', 'history');
```

Роутер читает и пишет ``location.pathname``; строка запроса и хеш остаются как есть.

> На странице с бандлом, подключенным тегом script, функция доступна как ``Matreshka.initRouter``.

**Возвращает:** [`object`](/ru/api/types/object/) – Первый аргумент

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `object` |  | [`object`](/ru/api/types/object/) | Объект |
| `route` |  | [`string`](/ru/api/types/string/) | Маршрут: имена свойств через косую черту, ``*`` для части, которая не синхронизируется |
| `type` (необязательный) | `"hash"` | [`string`](/ru/api/types/string/) | ``"hash"`` или ``"history"`` |

## Ссылки

- [`Matreshka.Router`](/ru/api/router/)
- [Пример роутера](/examples/router/)
