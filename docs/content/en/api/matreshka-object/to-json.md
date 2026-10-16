---
title: "Matreshka.Object#toJSON"
sidebarTitle: "toJSON"
description: "Matreshka.Object#toJSON: Converts an instance and its internal properties into an ordinary object"
importance: 1
---

# Matreshka.Object#toJSON

**Method**

```js
Matreshka.Object#toJSON([recursive=true]) → object
```

Converts an instance and its internal properties into an ordinary object

The method works recursively, calling ``toJSON`` for all internal properties which have such method. To cancel this behavior pass ``false`` as the only argument.

**Returns:** [`object`](/api/types/object/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `recursive` (optional) | `true` | [`boolean`](/api/types/boolean/) |  |

## Examples

```js
const matreshkaObject = new Matreshka.Object({
	a: 1,
	b: 2,
	c: new Matreshka.Object({
		d: 3,
		e: 4
	})
});

// returns {a: 1, b: 2, c: { d: 3, e: 4 }}
console.log(matreshkaObject.toJSON());

// returns {a: 1, b: 2, c: MatreshkaObject}
console.log(matreshkaObject.toJSON(false));
```
