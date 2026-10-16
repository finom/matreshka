---
title: "Matreshka.Array.of"
sidebarTitle: "of"
description: "Matreshka.Array.of: Метод створює новий екземпляр Matreshka.Array з довільного числа агрумент, незалежно від числа або типу аргументів"
importance: 2
---

# Matreshka.Array.of

**Метод** · Починаючи з версії 1.1

```js
Matreshka.Array.of() → matreshkaArray
```

Метод створює новий екземпляр [`Matreshka.Array`](/ua/api/matreshka-array/) з довільного числа агрумент, незалежно від числа або типу аргументів

**Повертає:** [`matreshkaArray`](/ua/api/types/matreshka-array/)

## Посилання

- [Array.of](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/of)

## Приклади

```js
const matreshkaArray = Matreshka.Array.of(1, 2, 3, 4);
```

**Спадкування методу**

```js
class MyClass extends Matreshka.Array {
    // ...
}

const myArray = MyClass.of(1, 2, 3, 4);
console.log(myArray instanceof MyClass); // true
```
