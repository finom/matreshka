---
title: "Matreshka.toMatreshka"
sidebarTitle: "toMatreshka"
description: "Matreshka.toMatreshka: Функція, яка конвертує довільну структуру об'єктів і масивів в екземпляри Matreshka.Object та Matreshka.Array"
importance: 3
---

# Matreshka.toMatreshka

**Метод**

**Імпорт:**

```js
import { toMatreshka } from 'matreshka';
```

```js
Matreshka.toMatreshka() → matreshka
```

Функція, яка конвертує довільну структуру об'єктів і масивів в екземпляри [`Matreshka.Object`](/ua/api/matreshka-object/) та [`Matreshka.Array`](/ua/api/matreshka-array/)

Тільки масиви та екземпляри ``Matreshka.Array`` стають ``Matreshka.Array``; будь-який інший об'єкт, навіть з властивістю ``length``, стає ``Matreshka.Object``. З переданого ``Matreshka.Object`` беруться тільки ключі, що відповідають за дані.

**Повертає:** [`matreshka`](/ua/api/types/matreshka/) – новостворений екземпляр ``Matreshka``

## Приклади

```js
const matreshka = Matreshka.toMatreshka({
	a: 1,
	b: {
		c: 2
	},
	d: [{e: 1}, {e: 2}, {e: 3}]
});
```
