---
title: "Matreshka.Router"
description: "Matreshka.Router: The class behind initRouter, with the path, hashPath and parts properties"
importance: 3
---

# Matreshka.Router

**Class**

**Import:**

```js
import { Router } from 'matreshka/router';
```

[`Matreshka.initRouter`](/api/matreshka-static/init-router/) is powered by ``Matreshka.Router`` class. It accepts only one argument - router type (``"hash"``, ``"history"`` or a custom string).

By default, the library creates two instances of ``Matreshka.Router`` with types ``hash`` and ``history``. They live at ``Matreshka.Router.hash`` and ``Matreshka.Router.history``. The router uses lazy initialization so when you just attach the script onto webpage, the library does nothing.

For these two types of instances the singleton pattern is used. That means when you're trying to create another instance of ``hash`` routing via ``new Matreshka.Router('hash')``, the ``Matreshka.Router.hash`` will be returned instead of new instance creation. This logic centralizes URL handling, gives positive effect to the performance and doesn't make potential collisions. Objects which are handled by ``initRouter`` just subscribe to the changes of needed type of the router.

Custom instances (non-hash and non-history) of ``Matreshka.Router`` can be created manually in case if you generate URL for further use. At this case changes of target properties don't affect on ``hash`` and don't call ``pushState``.

#### Properties

``Matreshka.Router`` instances has 3 properties.

- ``path`` - contains actual URL, eg ``/foo/bar/baz/``.
- ``hashPath`` - contains actual URL and hashbang as a prefix, eg ``#!/foo/bar/baz/``
- ``parts`` - contains an array of all parts of the path, eg ``['foo', 'bar', 'baz']``.

All these properties are created using [`Matreshka#calc`](/api/matreshka/calc/), which means when you change one property, the others are changed automatically.

```js
Matreshka.Router.hash.path = '/foo/bar/baz/';
```

By changing these properties you can trigger needed procedures (update the path, change subscribed objects etc.)

#### Methods

- ``subscribe(object, route)`` - subscribes object for route changes.
- ``init()`` - used for lazy initialization in  ``subscribe`` method (no need to call it manually).

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `type` | [`string`](/api/types/string/) | ``"hash"``, ``"history"`` or a custom string |

## Examples

```js
const customRouter = new Matreshka.Router('myType');
const object = {
	a: 'foo',
	b: 'bar'
};

customRouter.subscribe(object, '/a/b/');

console.log(customRouter.path); // /foo/bar/
```
