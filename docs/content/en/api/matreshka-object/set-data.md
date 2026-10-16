---
title: "Matreshka.Object#setData"
sidebarTitle: "setData"
description: "Matreshka.Object#setData: Sets a property and adds property name to a list of property names which are responsible for data"
importance: 1
---

# Matreshka.Object#setData

**Method**

```js
Matreshka.Object#setData(key, value, [eventOptions]) → matreshkaObject
```

Sets a property and adds property name to a list of property names which are responsible for data

Synonym: `Matreshka.Object#jset`

This method does two things:

1. Sets a specified value to a given property.

2. Adds a key to data keys list which it makes property available for using in the [`Matreshka.Object#each`](/api/matreshka-object/each/), [`Matreshka.Object#keys`](/api/matreshka-object/keys/), [`Matreshka.Object#toJSON`](/api/matreshka-object/to-json/) and other methods.

> When  ``replaceData`` flag is set as ``true`` then all other properties will be removed from the list of data properties.

Apart from that, the method works the same as [`Matreshka#set`](/api/matreshka/set/).

**Returns:** [`matreshkaObject`](/api/types/matreshka-object/) – self

**Fires:** `change`, `change:KEY`, `modify`, `set`

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `key` | [`string`](/api/types/string/) | A key |
| `value` | [`*`](/api/types/any/) | A value |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | An event options |

## Links

- [`Matreshka#set`](/api/matreshka/set/)

## Examples

```js
this.setData('a', 1).setData('b', 2);

// assign 3 to the 'c' property,
// but do not add the key to a list of keys which are responsible for data
this.set('c', 3);

this.each((value, key) => {
	console.log(key, value);
});
// displays  'a' 1 and 'b' 2

console.log(this.keys()); // displays  ['a', 'b']

console.log(this.toJSON()); // displays  { a: 1, b: 2 }
```

**After using the [`Matreshka.Object#setData`](/api/matreshka-object/set-data/) method, you can work with a property like with an ordinary one**

```js
this.setData('a', 1).setData('b', 2);
this.set('a', 3);
this.b = 4;
```

**The use of alternative method name ``jset``**

```js
this.jset('a', 1);
```

## Alternative syntax of the Matreshka.Object#setData method that uses a "key-value" object for setting several properties at once [#variation-2]

```js
Matreshka.Object#setData(keyValuePairs, evtOpts) → matreshkaObject
```

**Returns:** [`matreshkaObject`](/api/types/matreshka-object/) – self

### Arguments

| Name | Type | Details |
| --- | --- | --- |
| `keyValuePairs` | [`object`](/api/types/object/) | A key-value object |
| `evtOpts` | [`eventOptions`](/api/types/event-options/) | A event object |

### Examples

```js
this.setData({
	a: 1,
	b: 2
});
```

**If ``replaceData`` event option set as ``true``, then other properties will be removed from a list of data properties**

```js
this
	.addDataKeys(['a', 'b', 'c'])
	.setData({
		a: 1,
		b: 2
	}, {
		replaceData: true
	});

console.log(this.keys()); // ['a', 'b']
```
