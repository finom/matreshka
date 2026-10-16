# matreshka-parse-form

[![npm version](https://img.shields.io/npm/v/matreshka-parse-form.svg)](https://www.npmjs.com/package/matreshka-parse-form)

Binds the named fields of an HTML form (`input`, `select`, `textarea`, `output`, `progress`) to the properties of the same names, for [Matreshka.js](https://matreshka.js.org).

[Demo](https://matreshka.js.org/examples/parse-form/)

```html
<form class="my-form">
  <input type="text" value="foo" name="x">
</form>
```

```js
const object = {};
parseForm(object, '.my-form');

console.log(object.x); // 'foo'
object.x = 'bar'; // changes the input value to 'bar'
```

## Installing

```
npm install matreshka matreshka-parse-form
```

```js
import parseForm from 'matreshka-parse-form';
```

CommonJS:

```js
const parseForm = require('matreshka-parse-form');
```

In a page, load the bundle after Matreshka's. It adds `Matreshka.parseForm`:

```html
<script src="https://cdn.jsdelivr.net/npm/matreshka@2/dist/matreshka.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/matreshka-parse-form@2/dist/matreshka-parse-form.min.js"></script>
```

```js
Matreshka.parseForm(object, form);
```

Imported as a module, it adds it only when a global `Matreshka` exists (the bundle in a page), never to an imported `Matreshka`.

## API

`parseForm(object, form, callback, eventOptions)`:

- `object`: an object or a function (required).
- `form`: the form, as a selector, an HTML string, a DOM node or an array-like of nodes; the custom selectors `:sandbox` and `:bound(KEY)` work too (required). For a `<form>`, the fields tied to it with the `form` attribute are bound as well. Any other element binds the fields inside it.
- `callback`: called for every bound field with the field name and the field element.
- `eventOptions`: event options passed to every internal `bindNode` call.

Returns the form element, or `null` when the form isn't found (then nothing is bound).

The callback is handy with `Matreshka.Object`, to call `addDataKeys`:

```js
const form = parseForm(this, ':sandbox .foo', (key) => this.addDataKeys(key), {
  getValueOnBind: false
});
```
