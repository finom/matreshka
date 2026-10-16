---
title: "Matreshka.Object#toJSON"
sidebarTitle: "toJSON"
description: "Matreshka.Object#toJSON: Конвертує екземпляр Matreshka.Object в звичайний об'єкт"
importance: 1
---

# Matreshka.Object#toJSON

**Метод**

```js
Matreshka.Object#toJSON([recursive=true]) → object
```

Конвертує екземпляр [`Matreshka.Object`](/ua/api/matreshka-object/) в звичайний об'єкт

Метод працює рекурсивно, викликаючи ``toJSON`` для всіх властивостей, у яких є метод з таким ім'ям. Для скасування рекурсії передайте ``false`` першим аргументом.

**Повертає:** [`object`](/ua/api/types/object/)

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `recursive` (необов'язковий) | `true` | [`boolean`](/ua/api/types/boolean/) |  |

## Приклади

```js
const matreshkaObject = new Matreshka.Object({
	a: 1,
	b: 2,
	c: new Matreshka.Object({
		d: 3,
		e: 4
	})
});

// повертає {a: 1, b: 2, c: { d: 3, e: 4 }}
console.log(matreshkaObject.toJSON());

// повертає {a: 1, b: 2, c: MatreshkaObject}
console.log(matreshkaObject.toJSON(false));
```
