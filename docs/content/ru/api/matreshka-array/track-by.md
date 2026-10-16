---
title: "Matreshka.Array#trackBy"
sidebarTitle: "trackBy"
description: "Matreshka.Array#trackBy: Свойство trackBy указывает на имя свойства идентификатора объектов, входящих в массив"
importance: 2
---

# Matreshka.Array#trackBy

**Свойство** · Начиная с версии 1.2 · Определяется вами

```js
Matreshka.Array#trackBy: string
```

Свойство ``trackBy`` указывает на имя свойства идентификатора объектов, входящих в массив

В случае, если клиент и сервер активно обмениваются данными (например, списком пользователей), а объекты, входящие в массив имеют уникальный ID (например, идентификатор пользователя), то перерисовка всей коллекции с нуля не имеет смысла. После того, как сервер вернул новую коллекцию, намного рациональнее проверить, есть ли в коллекции объект с таким же ID и, если объект найден, обновить его. Таким образом, не создаётся новый объект (экземпляр [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/)) и не рисуется новый DOM узел.

``trackBy`` работает только при использовании метода [`Matreshka.Array#recreate`](/ru/api/matreshka-array/recreate/), так как это единственный метод "пересоздающий" коллекцию заново.

В примере ниже используется ``_id`` в качестве значения (значение может быть любым).

```js
class MyArray extends Matreshka.Array {
	get trackBy() {
		return '_id';
	}
	constructor() {
		//...
	}
}

const arr = new MyArray();

// добавит три объекта в массив
arr.recreate([
	{_id: 0, name: 'Foo'},
	{_id: 1, name: 'Bar'},
	{_id: 2, name: 'Baz'}
]);

// удалит объект с идентификатором 0
// добавит объект с идентификатором 3
// обновит объект с идентификатором 1, обновив name: Bar -> BarNew
// обновит объект с идентификатором 2, обновив name: Baz -> BazNew
// пересортирует коллекцию в соответствие с переданным данным
arr.recreate([
	{_id: 1, name: 'BarNew'},
	{_id: 3, name: 'Qux'},
	{_id: 2, name: 'BazNew'}
]);
```

Свойство может содержать специальное значение ``"$index"``, которое позволяет обновлять объект по индексу в коллекции.

```js
class MyArray extends Matreshka.Array {
	get trackBy() {
		return '$index';
	}
	constructor() {
		//...
	}
}

const arr = new MyArray();

// добавит три объекта в массив
arr.recreate([
	{name: 'Foo'},
	{name: 'Bar'},
	{name: 'Baz'}
]);

// обновит все три объекта новыми данными
// и добавит новый объект с именем Qux
arr.recreate([
	{name: 'NewFoo'},
	{name: 'NewBar'},
	{name: 'NewBaz'},
	{name: 'Qux'}
]);
```

## Ссылки

- [`Matreshka.Array#recreate`](/ru/api/matreshka-array/recreate/)
