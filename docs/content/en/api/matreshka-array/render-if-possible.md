---
title: "Matreshka.Array#renderIfPossible"
sidebarTitle: "renderIfPossible"
description: "Matreshka.Array#renderIfPossible: The renderIfPossible property cancels the array rendering if it equals false"
importance: 3
---

# Matreshka.Array#renderIfPossible

**Property**

```js
Matreshka.Array#renderIfPossible: boolean
```

The ``renderIfPossible`` property cancels the array rendering if it equals ``false``

## Links

- [`Matreshka.Array#itemRenderer`](/api/matreshka-array/item-renderer/)

## Examples

```js
class MyArray extends Matreshka.Array {
    get renderIfPossible() {
        return false;
    }
    // ...
}
```
