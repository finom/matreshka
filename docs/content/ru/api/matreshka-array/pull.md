---
title: "Matreshka.Array#pull"
sidebarTitle: "pull"
description: "Matreshka.Array#pull: Удаляет элемент по индексу или по значению"
importance: 2
---

# Matreshka.Array#pull

**Метод**

```js
Matreshka.Array#pull(indexOrValue, [eventOptions]) → *|null
```

Удаляет элемент по индексу или по значению

**Возвращает:** [`*`](/ru/api/types/any/) \| [`null`](/ru/api/types/null/) – Удаленный элемент или ``null``

**Генерирует события:** `pull`, `remove`, `removeone`, `modify`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `indexOrValue` | [`object`](/ru/api/types/object/) \| [`number`](/ru/api/types/number/) | Индекс элемента, который нужно удалить (число) либо удаляемый элемент (объект) |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события на случай, если нужно передать в обработчик события какие-нибудь данные или установить служебные флаги (например, ``silent``) |

## Примеры

**Передача индекса массива**

```js
let removed;

this.recreate(['a', 'b', 'c']);

removed = this.pull(1);

console.log(removed); // 'b'

console.log(this.join(',')); // 'a,c'
```

**Передача удаляемого элемента**

```js
const object1 = {};
const object2 = {};
const object3 = {};
let removed;

this.push(object1, object2, object3);

removed = this.pull(object2);

console.log(removed === object2); // true

console.log(this.length); // 2
```
