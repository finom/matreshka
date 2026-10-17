---
title: "Matreshka.parseForm"
sidebarTitle: "parseForm"
description: "Matreshka.parseForm: Binds named HTML form fields in a given HTML form to their corresponding properties"
importance: 2
---

# Matreshka.parseForm

**Method**

**Import:**

```js
import { parseForm } from 'matreshka/parse-form';
```

```js
Matreshka.parseForm(object, form, [callback], [eventOptions]) → node|null
```

The function binds named HTML form fields (input, select, textarea, etc.) in a given HTML form to their corresponding properties.

```html
<form class="my-form">
    <input type="text" value="foo" name="x">
</form>
```

```js
const object = {};
parseForm(object, '.my-form');

// ...
console.log(object.x); // 'foo'
object.x = 'bar'; // changes input value to 'bar'
```

The third argument is useful when ``parseForm`` is used with [`Matreshka.Object`](/api/matreshka-object/): you can call [`Matreshka.Object#addDataKeys`](/api/matreshka-object/add-data-keys/) method there.

```js
const form = parseForm(this, ':sandbox .foo', key => this.addDataKeys(key), {
    getValueOnBind: false
});
```

> In a page with the script tag bundle the function is ``Matreshka.parseForm``.

**Returns:** [`node`](/api/types/node/) \| [`null`](/api/types/null/) – The parsed form element, or ``null`` if the form isn't found

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `object` | [`object`](/api/types/object/) | An object |
| `form` | [`string`](/api/types/string/) \| [`node`](/api/types/node/) \| [`$nodes`](/api/types/dollar-nodes/) | A selector, DOM node, etc. of the given form (custom selectors ``:sandbox`` and ``:bound(KEY)`` also acceptable) |
| `callback` (optional) | [`function`](/api/types/function/) | A function which will be called on every found field; accepts field name and field element itself |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | Event options which will be passed to every internal call of [`Matreshka#bindNode`](/api/matreshka/bind-node/) |

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)
- [Form parser example](/examples/parse-form/)
