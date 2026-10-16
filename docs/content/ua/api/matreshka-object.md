---
title: "Matreshka.Object"
asIndexPage: true
description: "Matreshka.Object: Matreshka.Object - клас, який відповідає за дані вида ключ-значення. Його завданням є відділення службових властивостей від даних, які можна…"
importance: 1
---

# Matreshka.Object

**Клас** · extends `Matreshka`

**Імпорт:**

```js
import { MatreshkaObject } from 'matreshka';
```

``Matreshka.Object`` - клас, який відповідає за дані вида ключ-значення. Його завданням є відділення службових властивостей від даних, які можна передати на сервер або зберегти в локальному сховищі. Клас успадковується від класу [`Matreshka`](/ua/api/matreshka/) і включає всі його властивості та методи.

Уявіть собі, що ви створюєте клас, що включає властивості ``"a"``, ``"b"`` і ``"c"``. Припустимо ``"a"`` і ``"b"`` - це властивості які повинні бути відправлені на сервер, а властивість ``"c"`` лише відповідає за деякий стан програми (наприклад, містить суму ``"a"`` і ``"b"``). Властивість ``"c"`` не повинна бути відправлена на сервер. Тому нам потрібно відокремити **властивості, які відповідають за дані**.

Для того, щоб відокремити такі властивості від інших, можна скористатися методом [`Matreshka.Object#addDataKeys`](/ua/api/matreshka-object/add-data-keys/).
```js
this.addDataKeys(['a', 'b']);

this.a = 1;
this.b = 2;
this.c = 3;
```

Якщо ви заздалегідь не знаєте, які властивості є даними, можна завжди використовувати метод [`Matreshka.Object#setData`](/ua/api/matreshka-object/set-data/), який не тільки оголошує властивості, що відповідають за дані, але і відразу встановлює значення.
```js
this.setData({
	a: 1,
	b: 2
});

this.c = 3;
```

Після того, як додаток отримав інформацію про те, що є даними, екземпляр [`Matreshka.Object`](/ua/api/matreshka-object/) можна конвертувати в звичайний об'єкт методом [`Matreshka.Object#toJSON`](/ua/api/matreshka-object/to-json/) і передати на сервер або зберегти в локальній БД (наприклад, в ``localStorage``).
```js
// поверне об'єкт { a: 1, b: 2 }
this.toJSON();
```

#### Події

При додаванні і зміні властивостей, що відповідають за дані генеруються події ``set`` і ``modify``, при видаленні - ``remove`` і ``modify``. Тобто будь-які зміни даних можна слухати за допомогою ``modify``.
```js
this.on('modify', () => {
	alert('Object is modified');
});
```

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `data` (необов'язковий) | [`object`](/ua/api/types/object/) | Дані, що входять в новий екземпляр |

## Приклади

**Створення екземпляра з двома властивостями-даними**

```js
// те ж саме, що і new Matreshka.Object().setData({ a: 1, b: 2 });
new Matreshka.Object({ a: 1, b: 2 });
```

**Спадкування**

```js
class MyClass extends Matreshka.Object {
	constructor(data) {
		super(data).sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
```

**Спадкування за допомогою функції [`Matreshka.Class`](/ua/api/matreshka-static/class/)**

```js
const MyClass = Matreshka.Class({
	extends: Matreshka.Object,
	constructor(data) {
		this.setData(data).sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
```

**Перебір даних, використовуючи цикл for..of**

```js
const matreshkaObject = new Matreshka.Object({ a: 1, b: 2 });
for(let item of matreshkaObject) {
	console.log(item); // 1 .. 2
}
```

## Методи і властивості

- [`addDataKeys`](/ua/api/matreshka-object/add-data-keys/) – Додає задані імена властивостей в список імен властивостей, що відповідають за дані
- [`each`](/ua/api/matreshka-object/each/) – Перебирає властивості, що відповідають за дані
- [`entries`](/ua/api/matreshka-object/entries/) – Повертає масив пар імен і значень властивостей, що відповідають за дані
- [`isDataKey`](/ua/api/matreshka-object/is-data-key/) – Перевіряє, чи входить строка до списку імен властивостей, що відповідають за дані
- [`isMatreshkaObject`](/ua/api/matreshka-object/is-matreshka-object/) – Властивість ``isMatreshkaObject`` завжди дорівнює ``true`` для екземплярів [`Matreshka.Object`](/ua/api/matreshka-object/).
- [`keyOf`](/ua/api/matreshka-object/key-of/) – Шукає задане значення властивості серед властивостей, що відповідають за дані, і повертає ім'я властивості, якщо таке значення знайдено
- [`keys`](/ua/api/matreshka-object/keys/) – Повертає масив імен властивостей, що відповідають за дані
- [`removeDataKeys`](/ua/api/matreshka-object/remove-data-keys/) – Видаляє задані імена властивостей зі списку імен властивостей, що відповідають за дані (але не видаляє властивість)
- [`setData`](/ua/api/matreshka-object/set-data/) – Встановлює значення властивості і додає його ім'я в список імен властивостей, що відповідають за дані
- [`toJSON`](/ua/api/matreshka-object/to-json/) – Конвертує екземпляр [`Matreshka.Object`](/ua/api/matreshka-object/) в звичайний об'єкт
- [`values`](/ua/api/matreshka-object/values/) – Повертає масив значень властивостей, що відповідають за дані
