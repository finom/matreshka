---
title: "Matreshka.Array#recreate"
sidebarTitle: "recreate"
description: "Matreshka.Array#recreate: Перестворює екземпляр Matreshka.Array"
importance: 1
---

# Matreshka.Array#recreate

**Метод**

```js
Matreshka.Array#recreate([array], [eventOptions]) → matreshkaArray
```

Перестворює екземпляр [`Matreshka.Array`](/ua/api/matreshka-array/)

Метод дозволяє конвертувати будь-який масив (або об'єкт, подібний масиву) в екземпляр [`Matreshka.Array`](/ua/api/matreshka-array/). Якщо нічого не передано в якості першого аргументу, екземпляр очищується.

**Повертає:** [`matreshkaArray`](/ua/api/types/matreshka-array/) – self

**Генерує події:** `recreate`, `modify`, `add`, `addone`, `remove`, `removeone`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `array` (необов'язковий) | [`array`](/ua/api/types/array/) | Масив або масивоподібний об'єкт |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |

## Посилання

- [`Matreshka.Array#trackBy`](/ua/api/matreshka-array/track-by/)

## Приклади

```js
// очищаємо масив і додаємо 5 нових айтемів
this.recreate([1, 2, 3, 4, 5]);

// очищаємо масив
this.recreate();
```
