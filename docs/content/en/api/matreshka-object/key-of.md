---
title: "Matreshka.Object#keyOf"
sidebarTitle: "keyOf"
description: "Matreshka.Object#keyOf: Searches for specified property value among others which are responsible for data and returns one key if this value has been found…"
importance: 2
---

# Matreshka.Object#keyOf

**Method**

```js
Matreshka.Object#keyOf() → string|null
```

Searches for specified property value among others which are responsible for data and returns one key if this value has been found (very similar to ``Array.prototype.indexOf`` function)

**Returns:** [`string`](/api/types/string/) \| [`null`](/api/types/null/)

## Properties

| Name | Type | Details |
| --- | --- | --- |
| `value` | [`*`](/api/types/any/) | A value of any type which should be found among data keys |

## Examples

```js
const matreshkaObject = new Matreshka.Object({
	a: 1,
	b: 2
});

matreshkaObject.c = 3;

matreshkaObject.keyOf(1); // 'a'

matreshkaObject.keyOf(2); // 'b'

matreshkaObject.keyOf(3); // null
```
