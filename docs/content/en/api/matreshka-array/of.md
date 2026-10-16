---
title: "Matreshka.Array.of"
sidebarTitle: "of"
description: "Matreshka.Array.of: The function creates a new Matreshka.Array instance with a variable number of arguments, regardless of number or type of the arguments"
importance: 2
---

# Matreshka.Array.of

**Method**

```js
Matreshka.Array.of() → matreshkaArray
```

The function creates a new [`Matreshka.Array`](/api/matreshka-array/) instance with a variable number of arguments, regardless of number or type of the arguments

**Returns:** [`matreshkaArray`](/api/types/matreshka-array/)

## Links

- [Array.of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/of)

## Examples

```js
const matreshkaArray = Matreshka.Array.of(1, 2, 3, 4);
```

**Inheritance of the method**

```js
class MyClass extends Matreshka.Array {
    // ...
}

const myArray = MyClass.of(1, 2, 3, 4);
console.log(myArray instanceof MyClass); // true
```
