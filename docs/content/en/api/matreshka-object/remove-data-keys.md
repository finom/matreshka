---
title: "Matreshka.Object#removeDataKeys"
sidebarTitle: "removeDataKeys"
description: "Matreshka.Object#removeDataKeys: Deletes given property names from a list of property names which are responsible for data (but does not delete the properties)"
importance: 2
---

# Matreshka.Object#removeDataKeys

**Method**

```js
Matreshka.Object#removeDataKeys(keys) → matreshkaObject
```

Deletes given property names from a list of property names which are responsible for data (but does not delete the properties)

The ``remove`` event fires before ``modify``, as with [`Matreshka#remove`](/api/matreshka/remove/).

**Returns:** [`matreshkaObject`](/api/types/matreshka-object/) – self

**Fires:** `remove`, `modify`

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `keys` | [`string`](/api/types/string/) \| [`array`](/api/types/array/) | An array of property names or a list of args |

## Examples

```js
this.removeDataKeys(['a', 'b']);
```

```js
this.removeDataKeys('a', 'b');
```
