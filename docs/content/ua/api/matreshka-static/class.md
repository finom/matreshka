---
title: "Matreshka.Class"
sidebarTitle: "Class"
description: "Matreshka.Class: Реалізація класів, заснована на прототипному спадкуванні"
importance: 2
---

# Matreshka.Class

**Метод**

**Імпорт:**

```js
import { Class } from 'matreshka';
```

```js
Matreshka.Class(prototype, [statics]) → class
```

Реалізація класів, заснована на прототипному спадкуванні

Функція ``Class`` дозволяє використовувати класичне ООП в тих випадках, коли немає можливості скористатися синтаксисом ECMAScript 2015 classes.

Якщо ``prototype`` не має власної властивості ``constructor``, клас викликає батьківський конструктор з тими самими аргументами, як клас ECMAScript 2015 без конструктора. Як ``constructor`` можна передати клас ECMAScript 2015: він викликається при створенні екземпляра, але методи, оголошені в його тілі, не успадковуються; додайте їх у ``prototype``.

**Повертає:** [`class`](/ua/api/types/class/) – клас (точніше, конструктор класу)

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `prototype` | [`object`](/ua/api/types/object/) | Методи та властивості |
| `statics` (необов'язковий) | [`object`](/ua/api/types/object/) | Статичні методи та властивості |

## Приклади

```js
const A = Matreshka.Class({
	method1() { ... }
});

const B = Matreshka.Class({
	// B успадковується від A
	extends: A,
	method2() { ... }
});

const C = Matreshka.Class({
	// С успадковується від B
	extends: B,
	method2() {
		// виклик батьківського методу
		B.prototype.method2.apply(this, arguments);
	},
	method3(a, b) { ... }
});

const D = Matreshka.Class({
	// D успадковується від C
	extends: C,
	method3(a, b) {
		// виклик батьківського методу
		C.prototype.method2.call(this, arguments);
	}
});
```

**Передача об'єкта зі статичними методами і властивостями**

```js
const MyClass = Matreshka.Class({
	method() { ... }
}, {
	staticProp: 'foo',
	staticMethod() {
		return 'bar';
	}
});

alert(MyClass.staticProp); // foo
alert(MyClass.staticMethod()); // bar
```
