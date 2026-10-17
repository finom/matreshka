---
title: "Matreshka.initRouter"
sidebarTitle: "initRouter"
description: "Matreshka.initRouter: Вмикає двостороннє зв'язування даних між властивостями і частинами URL (хеш за замовчуванням або History API)"
importance: 2
---

# Matreshka.initRouter

**Метод**

**Імпорт:**

```js
import { initRouter } from 'matreshka/router';
```

```js
Matreshka.initRouter(object, route, [type="hash"]) → object
```

Вмикає двостороннє зв'язування даних між властивостями і частинами URL

За замовчуванням роутер працює з хешем: він використовує ``location.hash`` з hashbang (``#!/a/b/``). Щоб натомість використовувати шлях (``/a/b/``) через History API, передайте ``"history"`` третім аргументом.

```js
// використовується location.hash
initRouter(object, '/a/b/c/');
object.a = 'foo';
object.b = 'bar';
object.c = 'baz';

// location.hash стає #!/foo/bar/baz/
```

Якщо потрібно використовувати History API замість хешу, передайте ``"history"`` третім аргументом.

```js
initRouter(object, '/a/b/c/', 'history');
```

Як працює «традиційний» роутинг? Розробник задає правило (маршрут) і функцію, яка викликається, коли поточний шлях відповідає правилу.

```js
route("books/:id", id => {
	// щось робимо
});
```

Принцип ``initRouter`` інший. Ви вказуєте, яка частина URL (підтримуються і [хеш](https://developer.mozilla.org/uk/docs/Web/API/Location/hash), і [HTML5 History](https://developer.mozilla.org/uk/docs/Web/API/History_API)) синхронізується з якою властивістю.

Скажімо, потрібно синхронізувати ``"x"`` з першою частиною ``location.hash``, а ``"y"`` з другою.

```js
initRouter(object, '/x/y/');
```

Тепер, коли ви пишете...

```js
object.x = 'foo';
object.y = 'bar';
```

...``location.hash`` автоматично змінюється на ``#!/foo/bar/``

І навпаки. Коли URL змінюється вручну або кнопками «назад» і «вперед», властивості змінюються автоматично.

```js
location.hash = '#!/baz/qux/';

// ... за мить
console.log(object.x, object.y); // 'baz', 'qux'
```

Як завжди, зміни властивостей можна слухати методом [`Matreshka#on`](/ua/api/matreshka/on/).

```js
Matreshka.on(object, 'change:x', handler);
// для екземплярів Matreshka: this.on('change:x', handler);
```

Значення кодуються в URL і декодуються назад: ``object.x = 'a b/c'`` дає ``#!/a%20b%2Fc/``, а ``object.x`` залишається ``'a b/c'``. Хеш, який не починається з ``#!`` (якір на кшталт ``#top``), не є маршрутом.

#### Синтаксис зірочки

Якщо якусь частину шляху не потрібно синхронізувати з властивістю, поставте на її місце зірочку.

```js
initRouter(object, '/x/*/y');
```

Якщо хеш має вигляд ``#!/foo/bar/baz/``, то ``object.x = "foo"``, а ``object.y = "baz"``.

Це зручно, коли різні класи керують різними частинами шляху.

**class1.js**

```js
initRouter(this, '/x/*/');
```

**class2.js**

```js
initRouter(this, '/*/y/');
```

#### Дві речі, які треба запам'ятати

**1.** Якщо властивість має значення (не ``undefined``, ``null`` і не ``''``), URL змінюється одразу після виклику ``initRouter``. Властивість без значення отримує значення з URL.

```js
object.x = 'foo';

initRouter(object, '/x/y/');
```

**2.** Якщо властивість отримує ``null``, ``undefined`` або ``''``, усі наступні за нею властивості отримують ``null``.

```js
initRouter(object, '/x/y/z/u/');

object.y = null; // object.z і object.u теж стають null
```

Ідея в тому, щоб властивості відображали актуальний стан URL. Було б дивно отримати ``"z"`` зі значенням ``"foo"``, коли відповідної частини URL немає.

#### HTML5 History API

Роутер підтримує і HTML5 History. Для цього передайте функції ``initRouter`` необов'язковий аргумент ``type`` зі значенням ``"history"`` (за замовчуванням ``type`` дорівнює ``"hash"``).

```js
initRouter(object, '/x/y/z/', 'history');
```

Роутер читає і пише ``location.pathname``; рядок запиту і хеш залишаються як є.

> На сторінці з бандлом, підключеним тегом script, функція доступна як ``Matreshka.initRouter``.

**Повертає:** [`object`](/ua/api/types/object/) – Перший аргумент

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `object` |  | [`object`](/ua/api/types/object/) | Об'єкт |
| `route` |  | [`string`](/ua/api/types/string/) | Маршрут: імена властивостей через скісну риску, ``*`` для частини, яка не синхронізується |
| `type` (необов'язковий) | `"hash"` | [`string`](/ua/api/types/string/) | ``"hash"`` або ``"history"`` |

## Посилання

- [`Matreshka.Router`](/ua/api/router/)
- [Приклад роутера](/examples/router/)
