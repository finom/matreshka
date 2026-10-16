---
title: "Matreshka.Array#orderBy"
sidebarTitle: "orderBy"
description: "Matreshka.Array#orderBy: Sorts by properties of array items"
importance: 2
---

# Matreshka.Array#orderBy

**Method**

```js
Matreshka.Array#orderBy(keys, [orders=asc]) → matreshkaArray
```

Sorts by properties of array items

This method works almost like [orderBy from lodash](https://lodash.com/docs#orderBy). It accepts a key or a list of keys as the first arg and an order (asc/desc) or a list of orders as the second arg.

**Returns:** [`matreshkaArray`](/api/types/matreshka-array/) – self

**Fires:** `sort`

## Arguments

| Name | Default | Type | Details |
| --- | --- | --- | --- |
| `keys` |  | [`string`](/api/types/string/) \| [`array`](/api/types/array/) | A key or a list of keys |
| `orders` (optional) | `asc` | [`string`](/api/types/string/) \| [`array`](/api/types/array/) | An order or a list of orders corresponding to the list of keys |

## Examples

**A little example taken from lodash documentation**

```js
this.recreate([
    { 'user': 'fred',   'age': 48 },
    { 'user': 'barney', 'age': 34 },
    { 'user': 'fred',   'age': 42 },
    { 'user': 'barney', 'age': 36 }
]);

// sort by 'user' in ascending order and by 'age' in descending order
this.orderBy(['user', 'age'], ['asc', 'desc']);
// → [{"user":"barney","age":36},{"user":"barney","age":34},{"user":"fred","age":48},{"user":"fred","age":42}]
```
