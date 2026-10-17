---
title: "Matreshka#instantiate"
sidebarTitle: "instantiate"
description: "Matreshka#instantiate: Создаёт фиксированный экземпляр класса"
importance: 2
---

# Matreshka#instantiate

**Метод**

```js
Matreshka#instantiate(key, class, [updateCallback]) → object
```

Создаёт фиксированный экземпляр класса

> Обратите внимание, что у метода есть [статичный аналог](/ru/api/matreshka-static/instantiate/).

Метод создаёт и фиксирует экземпляр класса в качестве значения заданного свойства. При попытке переопределить свойство, вместо самого переопределения, экземпляр обновляется. Таким образом достигается целостность приложения, сделанном на базе Matreshka.

> Метод является надстройкой над [`Matreshka#mediate`](/ru/api/matreshka/mediate/) и переопределяет медиатор.

Экземпляр класса создается во время запуска метода ``instantiate``. Первым аргументом конструктора класса становится текущее значение свойства. В конструкторе класса необходимо предусмотреть то, что в него попадет либо ``undefined`` (если свойство не содержало до этого никаких данных), либо объект, с которым нужно что-то сделать (например, расширить экземпляр класса свойствами объекта).

> На деле это выглядит просто: вы создаете обычный класс, который почти всегда принимает какие-нибудь данные, которые нужно обработать (например, использовать их в методе [`Matreshka.Object#setData`](/ru/api/matreshka-object/set-data/)).

При попытке присвоить свойству другое значение, внутренний механизм метода ``instantiate``, вместо присваивания, делает следующее:
- Если указана функция ``updateCallback``, метод запускает его с двумя аргументами: текущим значением свойства и данными, которые код пытается присвоить.
- Если заданный класс унаследован от [`Matreshka.Object`](/ru/api/matreshka-object/), экземпляр обновляется новыми данными, используя метод [`Matreshka.Object#setData`](/ru/api/matreshka-object/set-data/) с флагом ``replaceData=true``.
- Если заданный класс унаследован от [`Matreshka.Array`](/ru/api/matreshka-array/), экземпляр обновляется новыми данными, используя метод [`Matreshka.Array#recreate`](/ru/api/matreshka-array/recreate/).
- Если не указана функция ``updateCallback`` и если класс не унаследован от [`Matreshka.Object`](/ru/api/matreshka-object/) или [`Matreshka.Array`](/ru/api/matreshka-array/), экземпляр расширяется свойствами объекта, который код пытается присвоить.

> Особенностью метода является отсутствие ограничений на источник класса. В качестве класса может выступать любая функция-конструктор. которая инициализируется с помощью оператора ``new``, а не только наследники [`Matreshka`](/ru/api/matreshka/).

**Возвращает:** [`object`](/ru/api/types/object/) – self

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `key` | [`string`](/ru/api/types/string/) \| [`array`](/ru/api/types/array/) | Имя свойства или массив имен свойств |
| `class` | [`function`](/ru/api/types/function/) | Класс, чей экземпляр становится значением свойства |
| `updateCallback` (необязательный) | [`function`](/ru/api/types/function/) | Функция, вызывающаяся при каждой попытке присвоить новые данные свойству, позволяющая кастомизировать логику обновления экземпляра класса новыми данными. Функция принимает два аргумента: текущее значение свойства (экземпляр класса) и данные, которые пытаются присвоить. |

## Примеры

```js
class MyClass {
    // ...
}

// ...

this.instantiate('x', MyClass);

// пытаемся присвоить свойству другое значение
this.x = { a: 42 };

// this.x по-прежнему экземпляр класса MyClass
alert(this.x instanceof MyClass); // true
alert(this.x.a); // 42
```

**Использование ``updateCallback``.**

```js
this.instantiate('x', MyClass, (instance, data) => {
	updateSomeHow(instance, data);
});
```

**Получение родителя и имени свойства. Кроме данных (первый аргумент), в конструктор создаваемого класса, передается ссылка на объект, вызвавший ``instantiate`` и имя созданного свойства**

```js
class MyClass extends Matreshka {
	constructor(data, parent, key) {
		super();
		// parent - это экземпляр MyParentClass,
        // который создал свойство
		// key - имя свойства ("х")
	}
}

class MyParentClass extends Matreshka {
	constructor() {
		super().instantiate('x', MyClass);
	}
}
```

**Нестандартный способ использования ``updateCallback`` для игнорирования любых изменений свойства.**

```js
this.instantiate('x', SubClass, () => {});
```

**В случае, если ваш класс не подерживает использование оператора ``new``, вместо ``instantiate`` воспользуйтесь методом [`Matreshka#mediate`](/ru/api/matreshka/mediate/).**

```js
this.mediate('x', (data, currentValue) => {
	return currentValue instanceof SomeClass
		? Object.assign(currentValue, data)
		: SomeLib.initInstance(SomeClass, data);
});
```

**Абстрактный пример с данными большой вложенности (для краткости используется синтаксис class instance fields)**

```js
// app.js
class App extends Matreshka {
	constructor(appData) {
		super();
		this.appData = appData;
		this.instantiate('appData', AppData);
	}
}

// app-data.js
class AppData extends Matreshka.Object {
	constructor(data) {
		super(data)
			.instantiate({
				friends: Friends,
				settings: Settings
			});
	}
}

// friend.js
class Friend extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
}

// friends.js
class Friends extends Matreshka.Array {
	get Model() { return Friend; }
	trackBy = 'id';
	constructor(data) {
		super(...data);
	}
}

// settings.js
class Settings extends Matreshka.Object {
	constructor(data) {
		super(data)
			.instantiate('credentials', Credentials);
	}
}

// credentials.js
class Credentials extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
}

// app-init.js
var app = new App({
	settings: {
		name: 'Vasiliy Vasiliev',
		credentials: {
			email: 'vasia.vasia@gmail.com'
		}
	},
	friends: [{
		name: 'Yulia Zuyeva',
		id: 1
	}, {
		name: 'Konstantin Konstantinopolsky',
		id: 2
	}, {
		name: 'nagibator3000',
		id: 3
	}]
});

// данные можно сериализовать и передать на сервер
JSON.stringify(app.appData);

// потом просто присвоить новые данные свойству appData
// при этом, структура классов не изменится
app.appData = {
	settings: {
		name: 'Petr Petrov',
		credentials: {
			email: 'petr.petrov@gmail.com'
		}
	},
	friends: [{
		name: 'Yulechka Zuyeva',
		id: 1
	}, {
		name: 'Konstantin Konstantinopolsky',
		id: 2
	}]
};
```

## Альтернативный синтаксис метода Matreshka#instantiate, принимающий в качестве аргумента объект "ключ-класс" [#variation-2]

```js
Matreshka#instantiate(keyClassPairs, [updateCallback]) → object
```

**Возвращает:** [`object`](/ru/api/types/object/) – self

### Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `keyClassPairs` | [`object`](/ru/api/types/object/) | Объект со свойствами ключ-класс |
| `updateCallback` (необязательный) | [`function`](/ru/api/types/function/) | Функция, вызывающаяся при каждой попытке присвоить новые данные свойству. |

### Примеры

```js
this.instantiate({
	x: Class1,
	y: Class2,
	z: Class3
}, (instance, data) => {
	instance.doSomethingWith(data);
});
```
