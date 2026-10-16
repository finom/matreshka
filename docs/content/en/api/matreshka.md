---
title: "Matreshka"
asIndexPage: true
description: "Matreshka: The class Matreshka is a core of the Matreshka.js framework which is inherited by Matreshka.Array, Matreshka.Object (and every class of an…"
importance: 1
---

# Matreshka

**Class**

**Import:**

```js
import Matreshka from 'matreshka';
```

The class ``Matreshka`` is a core of the Matreshka.js framework which is inherited by [`Matreshka.Array`](/api/matreshka-array/), [`Matreshka.Object`](/api/matreshka-object/) (and every class of an application you create). It contains the main functionality of the framework: [mediators](/api/matreshka/mediate/), [dependencies](/api/matreshka/calc/), [two-way data binding](/api/matreshka/bind-node/), [an event engine](/api/matreshka/on/), etc.

This class usually isn't used directly. Instead, it is inherited by other classes.

## Links

- [`Matreshka.Class`](/api/matreshka-static/class/)

## Examples

**Creating of an instance**

```js
const matreshka = new Matreshka();
```

**Inheritance**

```js
class MyClass extends Matreshka {
	constructor() {
		this.sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
```

**Inheritance using [`Matreshka.Class`](/api/matreshka-static/class/)**

```js
const MyClass = Matreshka.Class({
	'extends': Matreshka,
	constructor() {
		this.sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
```

## Members

- [`bindNode`](/api/matreshka/bind-node/) – Binds a property of an object to HTML node, implementing two-way data binding
- [`bindOptionalNode`](/api/matreshka/bind-optional-node/) – Works just the same as [`Matreshka#bindNode`](/api/matreshka/bind-node/) but it does not throw an exception if the ``node`` argument is an empty array, ``undefined`` or non-existent.
- [`bindSandbox`](/api/matreshka/bind-sandbox/) _(Advanced)_ – Binds a sandbox
- [`calc`](/api/matreshka/calc/) – Creates a dependency of one property value on values of others
- [`instantiate`](/api/matreshka/instantiate/) – Creates fixed class instance
- [`isMatreshka`](/api/matreshka/is-matreshka/) _(Advanced)_ – ``isMatreshka`` always equals ``true`` for instances of [`Matreshka`](/api/matreshka/)
- [`mediate`](/api/matreshka/mediate/) – Transforms property value on its changing
- [`$nodes`](/api/matreshka/dollar-nodes/) _(Advanced)_ – An object with an array of the bound nodes for each property, for quick access.
- [`nodes`](/api/matreshka/nodes/) _(Advanced)_ – The object contains bound elements in the form of separate DOM nodes for quick access
- [`off`](/api/matreshka/off/) – Deletes an event handler
- [`on`](/api/matreshka/on/) – Adds an event handler
- [`onDebounce`](/api/matreshka/on-debounce/) – Adds an event handler which is called only once during a definite period of time
- [`once`](/api/matreshka/once/) – Adds an event handler which can be called only once
- [`parseBindings`](/api/matreshka/parse-bindings/) – Parses DOM tree, declaring property bindings on which are double braced.
- [`remove`](/api/matreshka/remove/) _(Advanced)_ – Deletes a property
- [`select`](/api/matreshka/select/) – Returns HTML node corresponding to a selector from a sandbox
- [`selectAll`](/api/matreshka/select-all/) – Returns HTML nodes corresponding to a selector from a sandbox
- [`set`](/api/matreshka/set/) – Sets a property value allowing to pass event options object as the third argument
- [`trigger`](/api/matreshka/trigger/) – Fires an event
- [`unbindNode`](/api/matreshka/unbind-node/) – Destroys a binding between given property and HTML node

## Static methods

- [`Class`](/api/matreshka-static/class/) – An implementation of classes based on the prototype inheritance
- [`bindNode`](/api/matreshka-static/bind-node/) – Binds a property of an object to HTML node, implementing two-way data binding
- [`bindOptionalNode`](/api/matreshka-static/bind-optional-node/) _(Advanced)_ – Initializes two-way data binding but does not throws an exception if ``node`` argument is an empty array, ``undefined`` or non-existent
- [`bindSandbox`](/api/matreshka-static/bind-sandbox/) _(Advanced)_ – Binds or re-binds sandbox node
- [`calc`](/api/matreshka-static/calc/) – Creates a dependency of one property value on values of others
- [`chain`](/api/matreshka-static/chain/) – Allows chained calls of universal methods
- [`defaultBinders`](/api/matreshka-static/default-binders/) – An array of functions which return a corresponding binder
- [`instantiate`](/api/matreshka-static/instantiate/) _(Advanced)_ – Creates fixed class instance
- [`lookForBinder`](/api/matreshka-static/look-for-binder/) _(Advanced)_
- [`mediate`](/api/matreshka-static/mediate/) – Transforms property value on its changing
- [`off`](/api/matreshka-static/off/) _(Advanced)_ – Deletes an event handler
- [`on`](/api/matreshka-static/on/) – Adds an event handler
- [`onDebounce`](/api/matreshka-static/on-debounce/) _(Advanced)_ – Adds an event handler which is called only once during a definite period of time
- [`once`](/api/matreshka-static/once/) _(Advanced)_ – Adds event handler which can be called only once
- [`parseBindings`](/api/matreshka-static/parse-bindings/) _(Advanced)_ – Parses DOM tree, declaring bindings with properties enclosed in double braces
- [`parserBrackets`](/api/matreshka-static/parser-brackets/) _(Advanced)_ – Contains brackets for [bindings parser](/api/matreshka/parse-bindings/)
- [`remove`](/api/matreshka-static/remove/) _(Advanced)_ – Deletes a property
- [`select`](/api/matreshka-static/select/) _(Advanced)_ – Returns HTML node corresponding to a selector from a sandbox
- [`selectAll`](/api/matreshka-static/select-all/) _(Advanced)_ – Returns HTML nodes corresponding to a selector from a sandbox
- [`set`](/api/matreshka-static/set/) _(Advanced)_ – Sets a property value allowing to pass an event object as the third argument
- [`toMatreshka`](/api/matreshka-static/to-matreshka/) _(Advanced)_ – The function, converting any nested tree of objects and arrays into [`Matreshka.Object`](/api/matreshka-object/) and [`Matreshka.Array`](/api/matreshka-array/) instances
- [`trigger`](/api/matreshka-static/trigger/) _(Advanced)_ – Fires an event
- [`unbindNode`](/api/matreshka-static/unbind-node/) _(Advanced)_ – Breaks a binding between given property and HTML node
