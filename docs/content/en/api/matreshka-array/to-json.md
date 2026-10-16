---
title: "Matreshka.Array#toJSON"
sidebarTitle: "toJSON"
description: "Matreshka.Array#toJSON: Converts Matreshka.Array instance into native array"
importance: 1
---

# Matreshka.Array#toJSON

**Method**

```js
Matreshka.Array#toJSON([recursive=true]) → array
```

Converts [`Matreshka.Array`](/api/matreshka-array/) instance into native array

The method works recursively, calling ``toJSON`` for all items which have such method. To cancel this behavior pass ``false`` as the only argument.

**Returns:** [`array`](/api/types/array/)

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `recursive` (optional) | `true` | [`boolean`](/api/types/boolean/) |  |

## Examples

```js
const matreshkaArray = new Matreshka.Array([1, 2, new MatreshkaArray(3, 4)]);

// returns [1, 2, [3, 4]]
console.log(matreshkaArray.toJSON());

// returns [1, 2, MatreshkaArray]
console.log(matreshkaArray.toJSON(false));
```
