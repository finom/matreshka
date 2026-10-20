---
title: "Matreshka#instantiate"
sidebarTitle: "instantiate"
description: "Matreshka#instantiate: Creates fixed class instance. Matreshka.js API reference"
importance: 2
---

# Matreshka#instantiate

**Method**

```js
Matreshka#instantiate(key, class, [updateCallback]) → object
```

Creates fixed class instance

> Note that the method has [static alternative](/api/matreshka-static/instantiate/).

The method creates and fixes an instance of a class as given property value. When you try to override the property, instead of actual overriding, the instance is updated. Thus, we achieve integrity of an application, made on with Matreshka.js.

> The method is an addon over [`Matreshka#mediate`](/api/matreshka/mediate/) and it overrides a mediator.

Class instance is being created during the call of ``instantiate`` method. The current property value becomes the first argument of the class constructor. Provisions should be made so that either undefined (if a property hasn't contained any data before), or an object you should do something with (for example, to extend class instance by object properties) will get into the class constructor.

> It looks easy in practice: you create an ordinary class which almost always receives some data to be handled (for example, to use it at [`Matreshka.Object#setData`](/api/matreshka-object/set-data/) method).

While attempting to assign another value (an object or an array) to the property, the inner mechanism of ``instantiate`` method performs the following instead of the actual assignment:
- If ``updateCallback`` function is given, the method calls it with two arguments: current property value and the data which code is trying to assign.
- If given class is inherited from [`Matreshka.Object`](/api/matreshka-object/), the instance is updated with new data using [`Matreshka.Object#setData`](/api/matreshka-object/set-data/) method.
- If given class is inherited from [`Matreshka.Array`](/api/matreshka-array/), the instance is updated with new data using [`Matreshka.Array#recreate`](/api/matreshka-array/recreate/) method.
- If ``updateCallback`` function isn't given and the class isn’t inherited from [`Matreshka.Object`](/api/matreshka-object/) or [`Matreshka.Array`](/api/matreshka-array/), the instance is extended by object properties which is trying to be assigned.

> A feature of this method is an absence of limitations on the class source. Any function-constructor that can be initialized using ``new`` operator and not only [`Matreshka`](/api/matreshka/)'s successors can act as a class.

**Returns:** [`object`](/api/types/object/) – self

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `key` | [`string`](/api/types/string/) \| [`array`](/api/types/array/) | A key or an array of keys |
| `class` | [`function`](/api/types/function/) | A class whose instance becomes the property value |
| `updateCallback` (optional) | [`function`](/api/types/function/) | A function which is called at every attempt of assigning new data to the property, allowing to customize logic of class instance updating with new data. The function receives two arguments: the current property value (class instance) and data which are attempted to assign. |

## Examples

```js
class MyClass {
	// ...
}

// ...

this.instantiate('x', MyClass);

// trying to assign another value to x property
this.x = { a: 42 };

// this.x is still MyClass instance
alert(this.x instanceof MyClass); // true
alert(this.x.a); // 42
```

**The use of ``updateCallback``.**

```js
this.instantiate('x', MyClass, (instance, data) => {
	updateSomeHow(instance, data);
});
```

**Getting a parent and property name. Besides data (the first argument), two arguments are passed to class constructor: a reference to an instance which has called ``instantiate`` and a name of a property.**

```js
class MyClass extends Matreshka {
	constructor(data, parent, key) {
		super();
		// parent is MyParentClass instance
        // which is created x property
		// key equals to "x"
	}
}

class MyParentClass extends Matreshka {
	constructor() {
		super().instantiate('x', MyClass);
	}
}
```

**A non-standard way of using ``updateCallback`` for ignoring any changes of a property.**

```js
this.instantiate('x', MyClass, () => {});
```

**In case if your class doesn't support the use of ``new`` operator, use [`Matreshka#mediate`](/api/matreshka/mediate/) method instead of ``instantiate``.**

```js
this.mediate('x', (data, currentValue) => {
	return currentValue instanceof SomeClass
		? Object.assign(currentValue, data)
		: SomeLib.initInstance(SomeClass, data);
});
```

**An abstract example with nested data (for brevity, "class instance fields" syntax is used)**

```js
// app.js
class App extends Matreshka {
	constructor(appData) {
		super();
		this.appData = appData;
		this.instantiate('appData', AppData);
	}
}

// app-data.js
class AppData extends Matreshka.Object {
	constructor(data) {
		super(data)
			.instantiate({
				friends: Friends,
				settings: Settings
			});
	}
}

// friend.js
class Friend extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
}

// friends.js
class Friends extends Matreshka.Array {
	get Model() { return Friend; }
	trackBy = 'id';
	constructor(data) {
		super(...data);
	}
}

// settings.js
class Settings extends Matreshka.Object {
	constructor(data) {
		super(data)
			.instantiate('credentials', Credentials);
	}
}

// credentials.js
class Credentials extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
}

// app-init.js
var app = new App({
	settings: {
		name: 'Vasiliy Vasiliev',
		credentials: {
			email: 'vasia.vasia@gmail.com'
		}
	},
	friends: [{
		name: 'Yulia Zuyeva',
		id: 1
	}, {
		name: 'Konstantin Konstantinopolsky',
		id: 2
	}, {
		name: 'nagibator3000',
		id: 3
	}]
});

// data can be serialized and passed to a server
JSON.stringify(app.appData);

// next just to assign new data to appData property
// yet the object structure won’t be changed
app.appData = {
	settings: {
		name: 'Petr Petrov',
		credentials: {
			email: 'petr.petrov@gmail.com'
		}
	},
	friends: [{
		name: 'Yulechka Zuyeva',
		id: 1
	}, {
		name: 'Konstantin Konstantinopolsky',
		id: 2
	}]
};
```

## Additional syntax for Matreshka#instantiate, which accepts key-class object as the first argument. [#variation-2]

```js
Matreshka#instantiate(keyClassPairs, [updateCallback]) → object
```

**Returns:** [`object`](/api/types/object/) – self

### Arguments

| Name | Type | Details |
| --- | --- | --- |
| `keyClassPairs` | [`object`](/api/types/object/) | key-class object |
| `updateCallback` (optional) | [`function`](/api/types/function/) | A function which is called at every attempt of assigning new data to a property |

### Examples

```js
this.instantiate({
	x: Class1,
	y: Class2,
	z: Class3
}, (instance, data) => {
	instance.doSomethingWith(data);
});
```
