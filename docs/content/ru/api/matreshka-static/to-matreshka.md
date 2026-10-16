---
title: "Matreshka.toMatreshka"
sidebarTitle: "toMatreshka"
description: "Matreshka.toMatreshka: Функция, конвертирующая произвольную структуру объектов и массивов в экземпляры Matreshka.Object и Matreshka.Array"
importance: 3
---

# Matreshka.toMatreshka

**Метод** · Начиная с версии 1.1

**Импорт:**

```js
import toMatreshka from 'matreshka/tomatreshka';
```

```js
Matreshka.toMatreshka() → matreshka
```

Функция, конвертирующая произвольную структуру объектов и массивов в экземпляры [`Matreshka.Object`](/ru/api/matreshka-object/) и [`Matreshka.Array`](/ru/api/matreshka-array/)

Только массивы и экземпляры ``Matreshka.Array`` становятся ``Matreshka.Array``; любой другой объект, даже со свойством ``length``, становится ``Matreshka.Object``. Из переданного ``Matreshka.Object`` берутся только ключи, отвечающие за данные.

**Возвращает:** [`matreshka`](/ru/api/types/matreshka/) – новосозданный экземпляр ``Matreshka``

## Примеры

```js
const matreshka = Matreshka.toMatreshka({
	a: 1,
	b: {
		c: 2
	},
	d: [{e: 1}, {e: 2}, {e: 3}]
});
```
