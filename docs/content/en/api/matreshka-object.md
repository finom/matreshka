---
title: "Matreshka.Object"
asIndexPage: true
description: "Matreshka.Object: Matreshka.Object is a class which is responsible for key-value data. Its goal is to separate \"service\" properties from data that can be…"
importance: 1
---

# Matreshka.Object

**Class** · extends `Matreshka`

**Import:**

```js
import { MatreshkaObject } from 'matreshka';
```

``Matreshka.Object`` is a class which is responsible for key-value data. Its goal is to separate "service" properties from data that can be passed to a server or kept in a local storage. The class is inherited from the [`Matreshka`](/api/matreshka/) class and includes all its properties and methods.

Imagine you create an object which includes ``"a"``, ``"b"`` and ``"c"`` properties. Let's assume that ``"a"`` and ``"b"`` are the properties which must be sent to a server, and ``"c"`` property is just responsible for some application state (for example, it contains the sum of ``"a"`` and ``"b"``). The server does not need the ``"c"`` property. So we have to separate **the properties which are responsible for data** from ones which are not.

In order to declare such properties from others, you can make use of the [`Matreshka.Object#addDataKeys`](/api/matreshka-object/add-data-keys/) method.
```js
this.addDataKeys(['a', 'b']);

this.a = 1;
this.b = 2;
this.c = 3;
```

If you don't know which properties are specified in advance, you can always use the [`Matreshka.Object#setData`](/api/matreshka-object/set-data/) method, which declares not only properties responsible for data but sets their values at once.
```js
this.setData({
	a: 1,
	b: 2
});

this.c = 3;
```

After an application has found out what is data, [`Matreshka.Object`](/api/matreshka-object/) instance can be converted into an ordinary object by the [`Matreshka.Object#toJSON`](/api/matreshka-object/to-json/) method and passed to a server or kept in a local DB (for example, in ``localStorage``).
```js
// will return an object { a: 1, b: 2 }
this.toJSON();
```

#### Events

On add or change of data properties ``set`` and ``modify`` events are fired. On remove of data properties ``remove`` and ``modify`` events are fired. That means you can listen any changes of ``Matreshka.Object`` instance with the only ``modify`` event name.

```js
this.on('modify', () => {
	alert('an object is modified');
});
```

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `data` (optional) | [`object`](/api/types/object/) | Data |

## Examples

**Creation of an instance with two specified properties**

```js
// the same as new Matreshka.Object().setData({ a: 1, b: 2 });
new Matreshka.Object({ a: 1, b: 2 });
```

**The inheritance**

```js
class MyClass extends Matreshka.Object {
	constructor(data) {
		super(data).sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
```

**The inheritance using [`Matreshka.Class`](/api/matreshka-static/class/) function**

```js
const MyClass = Matreshka.Class({
	extends: Matreshka.Object,
	constructor(data) {
		this.setData(data).sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
```

**Data enumerating, using for..of**

```js
const matreshkaObject = new Matreshka.Object({ a: 1, b: 2 });
for(let item of matreshkaObject) {
	console.log(item); // 1 .. 2
}
```

## Methods and properties

- [`addDataKeys`](/api/matreshka-object/add-data-keys/) – Adds given property names to a list of property names which are responsible for data
- [`each`](/api/matreshka-object/each/) – Iterates properties which are responsible for data through ``callback`` function
- [`entries`](/api/matreshka-object/entries/) _(Advanced)_ – Returns an array of ``[key, value]`` pairs of properties which are responsible for data
- [`isDataKey`](/api/matreshka-object/is-data-key/) – Checks if given string a name of data property
- [`isMatreshkaObject`](/api/matreshka-object/is-matreshka-object/) _(Advanced)_ – The ``isMatreshkaObject`` property always equals ``true`` for instances of [`Matreshka.Object`](/api/matreshka-object/) class
- [`keyOf`](/api/matreshka-object/key-of/) – Searches for specified property value among others which are responsible for data and returns one key if this value has been found (very similar to ``Array.prototype.indexOf`` function)
- [`keys`](/api/matreshka-object/keys/) – Returns an array of property names which are responsible for data
- [`removeDataKeys`](/api/matreshka-object/remove-data-keys/) – Deletes given property names from a list of property names which are responsible for data (but does not delete the properties)
- [`setData`](/api/matreshka-object/set-data/) – Sets a property and adds property name to a list of property names which are responsible for data
- [`toJSON`](/api/matreshka-object/to-json/) – Converts an instance and its internal properties into an ordinary object
- [`values`](/api/matreshka-object/values/) _(Advanced)_ – Returns an array of property values which are responsible for data
