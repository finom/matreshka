---
title: "Matreshka.initRouter"
sidebarTitle: "initRouter"
description: "Matreshka.initRouter: Turns on two-way data binding between properties and parts of the URL (the hash by default, or the History API)"
importance: 2
---

# Matreshka.initRouter

**Method**

**Import:**

```js
import { initRouter } from 'matreshka/router';
```

```js
Matreshka.initRouter(object, route, [type="hash"]) → object
```

Turns on two-way data binding between properties and parts of the URL

The router is hash-based by default: it uses ``location.hash`` with a hashbang (``#!/a/b/``). Pass ``"history"`` as the third argument to use the path (``/a/b/``) through the History API instead.

```js
// location.hash is used there
initRouter(object, '/a/b/c/');
object.a = 'foo';
object.b = 'bar';
object.c = 'baz';

// makes location.hash to be #!/foo/bar/baz/
```

If you need to use History API instead of hash, pass ``"history"`` as the third argument.

```js
initRouter(object, '/a/b/c/', 'history');
```

How does "traditional" routing work? A developer defines a rule (route) and defines a function which will be called when current path fits given rule.

```js
route("books/:id", id => {
	// do something
});
```

The principle of ``initRouter`` is different. You define which part of URL (both [hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash), and [HTML5 History](https://developer.mozilla.org/en-US/docs/Web/API/History_API) are supported) need to be synchronized with given property.

Let's say you need to synchronize ``"x"`` with the first part of ``location.hash`` and ``"y"`` with the second.

```js
initRouter(object, '/x/y/');
```

Now when you type...

```js
object.x = 'foo';
object.y = 'bar';
```

...``location.hash`` is automatically changed to ``#!/foo/bar/``

And vice versa. When the URL is changed manually or via back and forward buttons, the properties will be changed automatically.

```js
location.hash = '#!/baz/qux/';

// ... after a moment
console.log(object.x, object.y); // 'baz', 'qux'
```

As usually you can listen property changes with [`Matreshka#on`](/api/matreshka/on/) method.

```js
Matreshka.on(object, 'change:x', handler);
// for Matreshka instances: this.on('change:x', handler);
```

Values are encoded in the URL and decoded back: ``object.x = 'a b/c'`` gives ``#!/a%20b%2Fc/``, and ``object.x`` stays ``'a b/c'``. A hash which doesn't start with ``#!`` (an anchor such as ``#top``) is not a route.

#### An asterisk syntax

You can pass a string which contain asterisks to ``initRouter`` if you don't need to synchronize some part of the path with a property.

```js
initRouter(object, '/x/*/y');
```

If the hash looks like ``#!/foo/bar/baz/``, then ``object.x = "foo"`` and ``object.y = "baz"``.

This feature is useful in cases when classes control different parts of the path.

**class1.js**

```js
initRouter(this, '/x/*/');
```

**class2.js**

```js
initRouter(this, '/*/y/');
```

#### Two things to remember

**1.** If a property has a value (not ``undefined``, ``null`` or ``''``) then URL will be changed immediately after ``initRouter`` call. A property without a value gets its value from the URL.

```js
object.x = 'foo';

initRouter(object, '/x/y/');
```

**2.** If a property gets ``null``, ``undefined`` or ``''`` then all next listed properties will get ``null`` as new value.

```js
initRouter(object, '/x/y/z/u/');

object.y = null; // makes object.z and object.u to be null as well
```

The idea is to get actual state of URL. It could be weird to get ``"z"`` with value ``"foo"`` in case of non-existing bound part of URL.

#### HTML5 History API

The router supports HTML5 History as well. To initialize it you need to pass optional argument ``type`` with ``"history"`` value to the ``initRouter`` function (by default ``type`` is ``"hash"``).

```js
initRouter(object, '/x/y/z/', 'history');
```

The router reads and writes ``location.pathname``; the query string and the hash stay as they are.

> In a page with the script tag bundle the function is ``Matreshka.initRouter``.

**Returns:** [`object`](/api/types/object/) – The first argument

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `object` |  | [`object`](/api/types/object/) | An object |
| `route` |  | [`string`](/api/types/string/) | A route: property names separated by slashes, ``*`` for a part which isn't synchronized |
| `type` (optional) | `"hash"` | [`string`](/api/types/string/) | ``"hash"`` or ``"history"`` |

## Links

- [`Matreshka.Router`](/api/router/)
- [Router example](/examples/router/)
