# matreshka-router

[![npm version](https://img.shields.io/npm/v/matreshka-router.svg)](https://www.npmjs.com/package/matreshka-router)

Two-way binding between object properties and parts of the URL, for [Matreshka.js](https://matreshka.js.org).

[Demo](https://matreshka.js.org/examples/router/)

## Installing

```
npm install matreshka matreshka-router
```

```js
import initRouter from 'matreshka-router';
import Router from 'matreshka-router/router';
```

CommonJS:

```js
const initRouter = require('matreshka-router');
const Router = require('matreshka-router/router');
```

In a page, load the bundle after Matreshka's. It adds `Matreshka.initRouter` and `Matreshka.Router`:

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@2/dist/matreshka.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/matreshka-router@2/dist/matreshka-router.min.js"></script>
```

Imported as a module, it adds them only when a global `Matreshka` exists (the bundle in a page), never to an imported `Matreshka`.

## tl;dr

```js
// location.hash is used
initRouter(object, '/a/b/c/');
object.a = 'foo';
object.b = 'bar';
object.c = 'baz';

// location.hash becomes #!/foo/bar/baz/
```

To use the History API instead of the hash, pass `'history'` as the third argument.

```js
initRouter(object, '/a/b/c/', 'history');
```

--------

A "traditional" router takes a rule (route) and a function that runs when the current path fits the rule.

```js
route('books/:id', (id) => {
  // do something
});
```

**matreshka-router** works differently. You say which part of the URL ([hash](https://developer.mozilla.org/en-US/docs/Web/API/Location/hash) or [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) path) is synchronized with which property.

To synchronize `x` with the first part of `location.hash` and `y` with the second:

```js
initRouter(object, '/x/y/');
```

Now this...

```js
object.x = 'foo';
object.y = 'bar';
```

...changes `location.hash` to `#!/foo/bar/`.

And the other way round: when the URL changes by hand or with the back and forward buttons, the properties change.

```js
location.hash = '#!/baz/qux/';

// ... after a moment
console.log(object.x, object.y); // 'baz', 'qux'
```

Listen to the changes with [on](https://matreshka.js.org/#!Matreshka-on):

```js
Matreshka.on(object, 'change:x', handler);
// for Matreshka instances: this.on('change:x', handler);
```

Values are encoded in the URL and decoded back: `object.x = 'a b/c'` gives `#!/a%20b%2Fc/`, and `object.x` stays `'a b/c'`. A hash that doesn't start with `#!` (an anchor such as `#top`) is not a route: the properties get `null`.

## The asterisk syntax

Put an asterisk in the route for a part of the path that isn't synchronized with a property.

```js
initRouter(object, '/x/*/y');
```

If the hash is `#!/foo/bar/baz/`, then `object.x` is `'foo'` and `object.y` is `'baz'`.

This is useful when classes control different parts of the path.

**class1.js**

```js
initRouter(this, '/x/*/');
```

**class2.js**

```js
initRouter(this, '/*/y/');
```

When a property changes, the parts of the URL after the route are dropped; an asterisk at the end keeps that part. Subscribing doesn't drop anything.

## Two things to remember

**1.** If a property has a truthy value, the URL changes right after the `initRouter` call. A property that is `undefined`, `null` or `''` gets its value from the URL.

```js
object.x = 'foo';

initRouter(object, '/x/y/');
```

**2.** If a property gets a falsy value, all the properties after it get `null`.

```js
initRouter(object, '/x/y/z/u/');

object.y = null; // makes object.z and object.u null as well
```

The properties always show the state of the URL: `z` with the value `'foo'` would be odd when that part of the URL doesn't exist.

## HTML5 History API

Pass `'history'` as the third argument (the type; the default is `'hash'`).

```js
initRouter(object, '/x/y/z/', 'history');
```

The router reads and writes `location.pathname`; the query string and the hash stay as they are. Each change adds a history entry; the back and forward buttons update the properties, the entry of the first page load included.

## `Router` class

**matreshka-router** is built on the `Router` class (`Matreshka.Router` in a page). Its only argument is the type: `'hash'`, `'history'` or any other string.

There are two instances, `Router.hash` and `Router.history`. They start lazily: loading the library does nothing until something subscribes.

These two are singletons: `new Router('hash')` returns `Router.hash` instead of a new instance. All the URL handling lives in one place, and the objects passed to `initRouter` subscribe to the router of their type.

Create other instances by hand to build a path for later use. Their properties don't touch `location.hash` and don't call `pushState`.

### Properties

- `path`: the path, for example `/foo/bar/baz/`, with each part encoded.
- `hashPath`: the path with the hashbang, for example `#!/foo/bar/baz/`.
- `parts`: the parts of the path, decoded, for example `['foo', 'bar', 'baz']`.

These properties are made with [calc](https://matreshka.js.org/#!Matreshka-calc): change one, and the others follow.

```js
Router.hash.path = '/foo/bar/baz/';
```

Changing them updates the URL and the subscribed objects.

### Methods

- `subscribe(object, route)` subscribes an object to the router.
- `init()` starts the router; `subscribe` calls it, so there is no need to call it by hand.

```js
const customRouter = new Router('myType');
const object = {
  a: 'foo',
  b: 'bar'
};

customRouter.subscribe(object, '/a/b/');

console.log(customRouter.path); // /foo/bar/
```
