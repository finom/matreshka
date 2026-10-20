---
title: "Matreshka.Array#toJSON"
sidebarTitle: "toJSON"
description: "Matreshka.Array#toJSON: Конвертує екземпляр Matreshka.Array в звичайний масив"
importance: 1
---

# Matreshka.Array#toJSON

**Метод**

```js
Matreshka.Array#toJSON([recursive=true]) → array
```

Конвертує екземпляр [`Matreshka.Array`](/ua/api/matreshka-array/) в звичайний масив

Метод працює рекурсивно, викликаючи ``toJSON`` для внутрішніх об'єктів, у яких є метод з таким ім'ям. Для скасування рекурсії передайте ``false`` першим аргументом.

**Повертає:** [`array`](/ua/api/types/array/)

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `recursive` (необов'язковий) | `true` | [`boolean`](/ua/api/types/boolean/) |  |

## Приклади

```js
const matreshkaArray = new Matreshka.Array(1, 2, new Matreshka.Array(3, 4));

// повертає [1, 2, [3, 4]]
console.log(matreshkaArray.toJSON());

// повертає [1, 2, MatreshkaArray]
console.log(matreshkaArray.toJSON(false));
```
