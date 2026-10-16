---
title: "Matreshka.Array.of"
sidebarTitle: "of"
description: "Matreshka.Array.of: Метод создаёт новый экземпляр Matreshka.Array из произвольного числа агрументов, вне зависимости от числа или типа аргумента"
importance: 2
---

# Matreshka.Array.of

**Метод**

```js
Matreshka.Array.of() → matreshkaArray
```

Метод создаёт новый экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/) из произвольного числа агрументов, вне зависимости от числа или типа аргумента

**Возвращает:** [`matreshkaArray`](/ru/api/types/matreshka-array/)

## Ссылки

- [Array.of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/of)

## Примеры

```js
const matreshkaArray = Matreshka.Array.of(1, 2, 3, 4);
```

**Наследование метода**

```js
class MyClass extends Matreshka.Array {
    // ...
}

const myArray = MyClass.of(1, 2, 3, 4);
console.log(myArray instanceof MyClass); // true
```
