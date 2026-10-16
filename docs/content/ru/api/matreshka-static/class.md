---
title: "Matreshka.Class"
sidebarTitle: "Class"
description: "Matreshka.Class: Реализация классов, основанная на прототипном наследовании"
importance: 2
---

# Matreshka.Class

**Метод**

**Импорт:**

```js
import { Class } from 'matreshka';
```

```js
Matreshka.Class(prototype, [statics]) → class
```

Реализация классов, основанная на прототипном наследовании

Функция ``Class`` позволяет использовать классическое ООП в тех случаях, когда нельзя воспользоваться синтаксисом ECMAScript 2015 classes.

Если у ``prototype`` нет собственного свойства ``constructor``, класс вызывает родительский конструктор с теми же аргументами, как класс ECMAScript 2015 без конструктора. В качестве ``constructor`` можно передать класс ECMAScript 2015: он вызывается при создании экземпляра, но методы, объявленные в его теле, не наследуются; добавьте их в ``prototype``.

**Возвращает:** [`class`](/ru/api/types/class/) – class (точнее, конструктор класса)

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `prototype` | [`object`](/ru/api/types/object/) | Методы и свойства |
| `statics` (необязательный) | [`object`](/ru/api/types/object/) | Статичные методы и свойства |

## Примеры

```js
const A = Matreshka.Class({
	method1() { ... }
});

const B = Matreshka.Class({
	// B наследуется от A
	extends: A,
	method2() { ... }
});

const C = Matreshka.Class({
	// С наследуется от B
	extends: B,
	method2() {
		// вызов родительского метода
		B.prototype.method2.apply(this, arguments);
	},
	method3(a, b) { ... }
});

const D = Matreshka.Class({
	// D наследуется от C
	extends: C,
	method3(a, b) {
		// вызов родительского метода
		C.prototype.method3.apply(this, arguments);
	}
});
```

**Передача объекта со статичными методами и свойствами**

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
