---
title: "Matreshka#unbindNode"
sidebarTitle: "unbindNode"
description: "Matreshka#unbindNode: Destroys a binding between given property and HTML node"
importance: 2
---

# Matreshka#unbindNode

**Method**

```js
Matreshka#unbindNode(key, [node], [eventOptions]) → object
```

Destroys a binding between given property and HTML node

Using this method you can delete the binding between a property and HTML node, which has been added recently and no longer needed.

A key with dots is a path to a nested property, as in [`Matreshka#bindNode`](/api/matreshka/bind-node/); with the ``exactKey: true`` event option it is used as is. ``null`` as the key also removes the bindings of nested properties (``"a.b"``).

**Returns:** [`object`](/api/types/object/) – self

**Fires:** `unbind`, `unbind:KEY`

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `key` | [`string`](/api/types/string/) \| [`null`](/api/types/null/) | A key or an array of keys. If you pass ``null`` instead of the key, all bindings for the given instance will be deleted |
| `node` (optional) | [`string`](/api/types/string/) \| [`node`](/api/types/node/) \| [`$nodes`](/api/types/dollar-nodes/) | HTML node |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | Event object (``"silent"`` key disables firing the events ``"unbind"`` and ``"unbind:KEY"``) |

## Examples

```js
this.bindNode('myKey', '.my-element');

// changes the property value and the state of the HTML element
this.myKey = true;

this.unbindNode('myKey', '.my-element');

// only the property value is being changed now
this.myKey = false;
```

## Alternative syntax which allows to pass an object with bindings to unbindNode. Look at Matreshka#bindNode(2) for more information [#variation-2]

```js
Matreshka#unbindNode(bindings, [eventOptions]) → object
```

**Returns:** [`object`](/api/types/object/) – self

### Arguments

| Name | Type | Details |
| --- | --- | --- |
| `bindings` | [`object`](/api/types/object/) | (see the example) |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | (see above) |

### Examples

```js
this.unbindNode({
	foo: '.aaa'
	bar: {
		node: '.bbb'
	},
	baz: [{
		node: '.ccc'
	}, {
		node: '.ddd'
	}]
});
```

## Alternative syntax of the method which allows to easily unbind unlimited amount of bindings by single unbindNode call. [#variation-3]

```js
Matreshka#unbindNode(batch, [eventOptions])
```

The variation makes possible to pass an array which includes objects with the following properties:

- ``key`` - a property name
- ``node`` - a node bound to ``key`` (optional)

This variation is useful because it matches one variation of [`Matreshka#bindNode`](/api/matreshka/bind-node/) method, allowing to store bindings in a variable to easily remove them when needed.

### Arguments

| Name | Type | Details |
| --- | --- | --- |
| `batch` | [`array`](/api/types/array/) | An array of bindings |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | (see above) |

### Examples

```js
const temporaryBindings = [{
	key: 'a',
	node: '.my-node',
	binder: {
		setValue(v) {
			doSomething(v);
		}
	}
}, {
	key: 'b',
	node: document.querySelectorAll('.bar')
	event: {
		foo: 'bar'
	}
}, {
	key: 'c.d.e',
	node: jQuery('.baz'),
	binder: Matreshka.binders.html(),
	event: {
		silent: true,
		exactKey: true
	}
}]

this.bindNode(temporaryBindings);

// these bindings are no longer needed
this.unbindNode(temporaryBindings);
```
