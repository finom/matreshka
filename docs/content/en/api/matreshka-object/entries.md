---
title: "Matreshka.Object#entries"
sidebarTitle: "entries"
description: "Matreshka.Object#entries: Returns an array of [key, value] pairs of properties which are responsible for data"
importance: 3
---

# Matreshka.Object#entries

**Method**

```js
Matreshka.Object#entries() → array
```

Returns an array of ``[key, value]`` pairs of properties which are responsible for data

**Returns:** [`array`](/api/types/array/) – entries

## Examples

```js
for(const [key, value] of this.entries()) {
    console.log(key, value);
}
```
