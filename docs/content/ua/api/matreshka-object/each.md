---
title: "Matreshka.Object#each"
sidebarTitle: "each"
description: "Matreshka.Object#each: Перебирає властивості, що відповідають за дані"
importance: 2
---

# Matreshka.Object#each

**Метод**

```js
Matreshka.Object#each(callback, [thisArg]) → matreshkaObject
```

Перебирає властивості, що відповідають за дані

Метод дуже схожий на ``Array.prototype.forEach`` і є альтернативою циклу for..of.

**Повертає:** [`matreshkaObject`](/ua/api/types/matreshka-object/) – self

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `callback` | [`function`](/ua/api/types/function/) | Функція, яка викликається на кожній ітерації |
| `thisArg` (необов'язковий) | [`*`](/ua/api/types/any/) | Контекст функції |

## Приклади

```js
this
	.setData({ a: 1, b: 2 })
	.addDataKeys('c')
	.each((value, key) => {
		console.log(key, value);
	});
;
// >>> a 1, b 2, c undefined
```
