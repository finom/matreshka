---
title: "Matreshka.Array#toJSON"
sidebarTitle: "toJSON"
description: "Matreshka.Array#toJSON: Конвертирует экземпляр Matreshka.Array в обычный массив"
importance: 1
---

# Matreshka.Array#toJSON

**Метод**

```js
Matreshka.Array#toJSON([recursive=true]) → array
```

Конвертирует экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/) в обычный массив

Метод работает рекурсивно, вызывая ``toJSON`` для входящих объектов, у которых есть метод с таким именем. Для отмены рекурсии передайте ``false`` первым аргументом.

**Возвращает:** [`array`](/ru/api/types/array/)

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `recursive` (необязательный) | `true` | [`boolean`](/ru/api/types/boolean/) |  |

## Примеры

```js
const matreshkaArray = new Matreshka.Array(1, 2, new MatreshkaArray(3, 4));

// возвращает [1, 2, [3, 4]]
console.log(matreshkaArray.toJSON());

// возвращает [1, 2, MatreshkaArray]
console.log(matreshkaArray.toJSON(false));
```
