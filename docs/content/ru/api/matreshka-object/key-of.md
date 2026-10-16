---
title: "Matreshka.Object#keyOf"
sidebarTitle: "keyOf"
description: "Matreshka.Object#keyOf: Ищет заданное значение свойства среди свойств, отвечающих за данные, и возвращает имя первого совпавшего свойства, если такое значение…"
importance: 2
---

# Matreshka.Object#keyOf

**Метод**

```js
Matreshka.Object#keyOf() → string|null
```

Ищет заданное значение свойства среди свойств, отвечающих за данные, и возвращает имя первого совпавшего свойства, если такое значение найдено

**Возвращает:** [`string`](/ru/api/types/string/) \| [`null`](/ru/api/types/null/) – имя свойства

## Свойства

| Имя | Тип | Описание |
| --- | --- | --- |
| `value` | [`*`](/ru/api/types/any/) | значение любого типа, которое следует найти среди данных |

## Примеры

```js
const matreshkaObject = new Matreshka.Object({
	a: 1,
	b: 2
});

matreshkaObject.c = 3;

matreshkaObject.keyOf(1); // 'a'

matreshkaObject.keyOf(2); // 'b'

matreshkaObject.keyOf(3); // null
```
