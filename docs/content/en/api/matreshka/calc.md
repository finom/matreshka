---
title: "Matreshka#calc"
sidebarTitle: "calc"
description: "Matreshka#calc: Creates a dependency of one property value on values of others"
importance: 1
---

# Matreshka#calc

**Method**

```js
Matreshka#calc(target, source, [handler=(v)=>v], [eventOptions])
```

Creates a dependency of one property value on values of others

``calc`` creates a dependency of a property (``target`` argument) on values of other properties (``source`` argument). When source property is changed, ``target`` is re-calculated automatically.

> Note that the method has [static alternative](/api/matreshka-static/calc/), which works just the same but accepts any target object as the first argument, shifting rest arguments to the right.
```js
import { calc } from 'matreshka';
const object = {};
calc(object, target, source, handler, eventOptions);
// instead of this.calc(target, source, handler, eventOptions);
```

``source`` arg has few variations.

#### A string

A ``target`` property is dependent on ``source`` property.

```js
this.b = 1;
this.calc('a', 'b', b => b * 2);
console.log(this.a); // 2
```

#### An array of strings

A ``target`` is dependent on properties listed at ``source`` array.

```js
this.b = 1;
this.c = 2;
this.d = 3;
this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d);
console.log(this.a); // 6
```

#### An object with properties ``object`` and ``key``

At this case ``target`` property is dependent on a property from another object.

```js
const someObject = { b: 1 };
this.calc('a', {
	object: someObject,
	key: 'b'
}, b => b * 2);

console.log(this.a); // 2
```

``key`` property also accepts an array of property names.

```js
const someObject = {
	b: 1,
	c: 2,
	d: 3
};
this.calc('a', {
	object: someObject,
	key: ['b', 'c', 'd']
}, (b, c, d) => b + c + d);

console.log(this.a); // 6
```

#### An array of object with properties ``object`` и ``key``

This variation allows to define dependency from properties of different objects.

```js
const someObject = {
	b: 1,
	c: 2
};
const someObjectY = {
	d: 3
};
this.calc('a', [{
	object: someObject,
	key: ['b', 'c']
}, {
	object: someObjectY,
	key: 'd'
}], (b, c, d) => b + c + d);

console.log(this.a); // 6
```

#### A combination of strings (own properties) and objects

```js
this.b = 1;
this.c = 2;

const someObject = {
	d: 3,
	e: 4
};

this.calc('a', ['b', 'c', {
	object: someObject,
	key: ['d', 'e']
}], (b, c, d, e) => b + c + d + e);

console.log(this.a); // 10
```

For reasons of code purity, the combination of strings and objects inside ``source`` array is not recommended. Instead, pass an object whose ``object`` property refers to source object. An example below makes the same job as shown at the previous example.

```js
this.b = 1;
this.c = 2;

const someObject = {
	d: 3,
	e: 4
};

this.calc('a', [{
	object: this, // the target object is "this"
	key: ['b', 'c']
}, {
	object: someObject,
	key: ['d', 'e']
}], (b, c, d, e) => b + c + d + e);

console.log(this.a); // 10
```

#### A path to source property

If source property name includes a dot then the method initiates a dependency on a property from nested object.

```js
this.b = { c: { d: 1 } };
this.e = { f: { g: 2 } };

this.calc('a', ['b.c.d', 'e.f.g'], (d, g) => d + g);

console.log(this.a); // 3
```

The same thing works for external sources.
```js
this.b = { c: { d: 1 } };
const someObject = { e: { f: { g: 2 } } };

this.calc('a', [{
	object: this,
	key: 'b.c.d'
}, {
	object: someObject,
	key: 'e.f.g'
}], (d, g) => d + g);

console.log(this.a); // 3
```

> The method is protected from circular references (for example, ``a`` depends on ``b``, ``b`` depends on ``c`` and ``c`` depends on ``a``) and if there is a calculation error, it does not block the page and does not throw an exception about the stack over-flow.

As you may noticed, arguments of ``handler`` function always follow the same order as source properties appear.

In case if you want to change a value of one source property and make it so that target property will not be recalculated, then use [`Matreshka#set`](/api/matreshka/set/) method with ``skipCalc`` flag.

```js
this.calc('a', 'b', handler);
this.set('b', newValue, {
    skipCalc: true
});
```

### Important features of the method and special flags

The fourth argument of ``calc`` method is  ``eventOptions``. As usual this object can include special flags or custom data which will be passed to ``change:TARGET`` event handler.

```js
this.on('change:a', evt => {
	console.log(evt.foo); // 'bar'
});

this.calc('a', source, handler, { foo: 'bar' });
```

When a source changes with the ``silent`` flag, the target changes silently too. Custom data of the source change also reaches the target's handlers. The ``force``, ``forceHTML``, ``silentHTML`` and ``skipMediator`` flags of the source change don't apply to the target.

#### A flag ``debounceCalc=true``

After ``calc`` is called, target property is calculated with no delays. But when source property is changed the debounce pattern is used. That means that target property will be changed in few milliseconds and only once even if source properties was changed many times in a short time.

```js
this.b = 1;
this.c = 2;
this.d = 3;

this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d);

this.on('change:a', () => {
	// the handler will be called only once
	// despite that source properties was changed thrice
	console.log(`a is changed to ${this.a}`); // a is changed to 60
});

this.b = 10;
this.c = 20;
this.d = 30;
console.log(this.a); // 6 instead of 60
```

To cancel debounce pattern when source properties are changed, in other words to make the calculation synchronously (as it was in previous versions of the method) pass ``debounceCalc`` with ``false`` value to the method.

```js
this.b = 1;
this.c = 2;
this.d = 3;

this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d, {
	debounceCalc: false
});

this.on('change:a', () => {
	// the handler will be called thrice
	// every time when b, c or d are changed

    // a is changed to... 15, 33, 60
	console.log(`a is changed to ${this.a}`);
});

this.b = 10;
this.c = 20;
this.d = 30;
console.log(this.a); // 60
```

#### A flag ``debounceCalcOnInit=false``

As described above, target property is calculated immediately after the ``calc`` is called. To turn on debounce on ``calc`` call pass ``debounceCalcOnInit`` with ``true`` value to the method.

```js
this.on('change:a', () => {
	// the handler will be called only once in a moment
	console.log(`a is changed to ${this.a}`); // a is changed to 6
});

this.b = 1;
this.c = 2;
this.d = 3;

this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d, {
    debounceCalcOnInit: true
});

console.log(this.a); // undefined
```

In real world ``debounceCalcOnInit`` flag is unlikely to be useful. Just keep in mind that you can enable "total debounce" if needed.

#### A flag ``debounceCalcDelay=0``

The flag can be used to set debounce delay when ``debounceCalc`` or ``debounceCalcOnInit`` is set as ``true``.

#### A flag ``setOnInit=true``

It is known that target property gets new value after ``calc`` is called. To cancel this behavior and don't calculate a property immediately use ``setOnInit`` with ``false`` value.

```js
this.calc('a', 'b', b => b * 2, {
    setOnInit: false
});

console.log(this.a); // undefined

// but if this.b is changed the target property will be calculated
this.b = 1;
```

#### A flag ``exactKey=false``

As described above, it's possible to use a path to source property using a string that contains dots. In case if you need to use exact name of source property use ``exactKey`` with ``true`` value.

```js
this['foo.bar.baz'] = 1;
this.calc('a', 'foo.bar.baz', fooBarBaz => fooBarBaz * 2, {
    exactKey: true
});
console.log(this.a); // 2
```

#### A flag ``promiseCalc=false``

This flag allows to return ``Promise`` instance from the calculating function. Target property gets its value from resolved promise.

> Warning! ``Promise`` cannot be canceled. Use the ``promiseCalc`` feature carefully and don't allow multiple calls of heavy functions.

If the sources change again before a promise resolves, only the latest calculation sets the target: the results of older ones are dropped.

```js
this.calc('a', ['b', 'c'], (b, c) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(b + c)
		}, 1000);
	});
}, {
	promiseCalc: true
});

this.b = 1;
this.c = 2;

// "a" will be changed in a second
```

```js
this.calc('response', 'data', async (data) => {
	const resp = await fetch(url, {
		method: 'post',
		body: data
	});

	return resp.json();
}, {
	promiseCalc: true
});
```

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `target` |  | [`string`](/api/types/string/) | A property which needs to be calculated |
| `source` |  | [`string`](/api/types/string/) \| [`array`](/api/types/array/) | Which properties the target property is depended on |
| `handler` (optional) | `(v)=>v` | [`function`](/api/types/function/) | A function which returns a new value |
| `eventOptions` (optional) |  | [`eventOptions`](/api/types/event-options/) | An object which can contain some special flags or data for ``change:KEY`` handler (see above) |

## Examples

```js
this.calc('greeting', 'name', name => `Hello, ${name}!`);

this.name = 'World';

// ... in a moment
alert(this.greeting); // 'Hello, World!'
```

**The calculation of the rectangle perimeter with two sides known (and the calculation of the sides with the perimeter known)**

```js
this.a = 3;
this.b = 4;

this
    .calc('p', ['a', 'b'], (a, b) => (a + b) * 2)
    .calc('a', ['p', 'b'], (p, b) => p/2 - b)
    .calc('b', ['p', 'a'], (p, a) => p/2 - a);

alert(this.p); // 14

this.on('change:p', () => {
    // "The perimeter has been changed and equals 18"
    console.log(`The perimeter has been changed and equals ${this.p}`);
});

this.a = 5;
```

## Extra syntax for Matreshka#calc. Allows to define few calculated properties per single call of the method. [#variation-batch]

```js
Matreshka#calc(batch, [commonEventOptions])
```

The first argument is an object whose keys are property names and values are objects with the following data:

- ``source`` - which properties the target property is depended on;
- ``handler`` - a function which returns a new value of a property (by default it equals to ``(value) => value``);
- ``event`` - event options.

The second argument contains common event options which extend ``event`` of every item (properties of ``event`` have higher priority).

``source`` can take any kind of look as [described above](/api/matreshka/calc/) (a string, an array of strings etc).

### Arguments

| Name | Type | Details |
| --- | --- | --- |
| `batch` | [`array`](/api/types/array/) | An object which includes all information about calculated properties |
| `commonEventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | Event options which are common for all listed calculated properties |

### Examples

```js
this.calc({
	x: {
    	source: ['a', 'b'],
    	handler: (a, b) => a + b
	},
	y: {
	    source: {
	        object: someObject,
	        key: 'c'
	    },
	    event: {
	        setOnInit: false
	    }
	},
	z: {
	    source: [{
	        object: this,
	        key: 'x'
	    }, {
	        object: someObject,
	        key: 'd'
	    }],
	    handler: (x, d) => x + d
	}
}, {
    debounceCalc: false
});
```
