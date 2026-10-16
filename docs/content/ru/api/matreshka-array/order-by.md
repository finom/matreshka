---
title: "Matreshka.Array#orderBy"
sidebarTitle: "orderBy"
description: "Matreshka.Array#orderBy: Сортирует массив по значениям свойств объектов, которые в него входят"
importance: 2
---

# Matreshka.Array#orderBy

**Метод** · Начиная с версии 1.6

```js
Matreshka.Array#orderBy(keys, [orders=asc]) → matreshkaArray
```

Сортирует массив по значениям свойств объектов, которые в него входят

Этот метод работает почти так же, как и метод [orderBy из lodash](https://lodash.com/docs#orderBy). Он принимает ключ или массив ключей - первым аргументом, порядок (asc/desc) или массив порядков - вторым.

**Возвращает:** [`matreshkaArray`](/ru/api/types/matreshka-array/) – self

**Генерирует события:** `sort`

## Аргументы

| Имя | По умолчанию | Тип | Описание |
| --- | --- | --- | --- |
| `keys` |  | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Ключ свойства или массив нескольких ключей, по которым коллекция будет отсортирована |
| `orders` (необязательный) | `asc` | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Порядок или массив порядков, соответствующих массиву ключей |

## Примеры

```js
this.recreate([
    { 'user': 'fred',   'age': 48 },
    { 'user': 'barney', 'age': 34 },
    { 'user': 'fred',   'age': 42 },
    { 'user': 'barney', 'age': 36 }
]);

// сортирует по значениям свойств 'user' по возрастанию и значениям свойств 'age' по убыванию
this.orderBy(['user', 'age'], ['asc', 'desc']);
// → [{"user":"barney","age":36},{"user":"barney","age":34},{"user":"fred","age":48},{"user":"fred","age":42}]
```
