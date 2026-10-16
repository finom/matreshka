---
title: "Matreshka.Array#recreate"
sidebarTitle: "recreate"
description: "Matreshka.Array#recreate: Пересоздает экземпляр Matreshka.Array"
importance: 1
---

# Matreshka.Array#recreate

**Метод**

```js
Matreshka.Array#recreate([array], [eventOptions]) → matreshkaArray
```

Пересоздает экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/)

Метод позволяет конвертировать любой массив (или объект, подобный массиву) в экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/). Если ничего не передано в качестве первого аргумента, экземпляр очищается.

**Возвращает:** [`matreshkaArray`](/ru/api/types/matreshka-array/) – self

**Генерирует события:** `recreate`, `modify`, `add`, `addone`, `remove`, `removeone`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `array` (необязательный) | [`array`](/ru/api/types/array/) | Массив или массивоподобный объект |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |

## Ссылки

- [`Matreshka.Array#trackBy`](/ru/api/matreshka-array/track-by/)

## Примеры

```js
// очищаем массив и добавляем 5 новых элементов
this.recreate([1, 2, 3, 4, 5]);

// очищаем массив
this.recreate();
```
