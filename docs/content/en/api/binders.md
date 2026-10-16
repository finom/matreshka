---
title: "Matreshka.binders"
asIndexPage: true
description: "Matreshka.binders: A namespace for binders. Out of the box it contains general-purpose binders and can be extended by you so as not to make a mess of the…"
importance: 1
---

# Matreshka.binders

**Namespace**

**Import:**

```js
import { binders } from 'matreshka';
```

A namespace for binders. Out of the box it contains general-purpose binders and can be extended by you so as not to make a mess of the global namespace.

Take a little agreement into consideration: every property from the ``Matreshka.binders`` namespace must be made as a function which returns a binder (such functions usually called "binder creators").

> At this documentation the properties from ``Matreshka.binders`` are used directly. But to make your code more readable it's recommended to assign them to a variable.

```js
const html = Matreshka.binders.html;

// ...
this.bindNode('x', node, html());
```
Or import them as CJS/ES2015 module:
```js
// import few binders per once
import { binders } from 'matreshka';

const { html, text, prop } = binders;
```

The binders ship with the ``matreshka`` package.

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/)

## Examples

```js
Matreshka.binders.myCoolBinder = (var1, var2) => {
	return {
		on: 'click',
		getValue() { ... },
		setValue() { ... },
		initialize() { ... },
		destroy() { ... }
	};
};

this.bindNode('myKey', '.my-element',
	Matreshka.binders.myCoolBinder('Hello', 'World'));
```

## Binders

- [`attr`](/api/binders/attr/) – Returns a binder which changes an attribute of DOM node depending on an object property value
- [`className`](/api/binders/class-name/) – Returns a binder which switches over DOM node class name depending on an object property value. If property value equals ``true`` non-strictly, a class name is added, otherwise - it's removed. The logic can be changed by passing ``false`` as the second argument and in this way, a class name will be added  when a property value equals ``false`` non-strictly and vice versa.
- [`dataset`](/api/binders/dataset/) – Returns a binder which changes given [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) property of bound DOM node depending on an object property value.
- [`display`](/api/binders/display/) – Returns a binder which controls a visibility of DOM node (using ``style.display``) depending on an object property value
- [`existence`](/api/binders/existence/) – Returns a binder which controls an existence of DOM node at DOM tree depending on an object property value
- [`html`](/api/binders/html/) – Returns a binder which changes ``innerHTML`` of bound DOM node depending on an object property value
- [`input`](/api/binders/input/) – Returns a binder which binds an object property to an ``input`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.
- [`output`](/api/binders/output/) – Returns a binder which binds an object property to an ``output`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.
- [`progress`](/api/binders/progress/) – Returns a binder which binds an object property to a ``progress`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.
- [`prop`](/api/binders/prop/) – Returns a binder which changes given property of DOM node depending on an object property value
- [`select`](/api/binders/select/) – Returns a binder which binds an object property to a ``select`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.
- [`style`](/api/binders/style/) – Returns a binder which changes given style property of bound DOM node depending on an object property value
- [`text`](/api/binders/text/) – Returns a binder which changes ``textContent`` of bound DOM node depending on an object property value
- [`textarea`](/api/binders/textarea/) – Returns a binder which binds an object property to a ``textarea`` element value. It is not obligatory to use the binder directly because it is included in the [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) list.
