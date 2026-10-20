---
title: "Matreshka#instantiate"
sidebarTitle: "instantiate"
description: "Matreshka#instantiate: Створює фіксований екземпляр класу"
importance: 2
---

# Matreshka#instantiate

**Метод**

```js
Matreshka#instantiate(key, class, [updateCallback]) → object
```

Створює фіксований екземпляр класу

> Зверніть увагу, що у метода є [статичний аналог](/ua/api/matreshka-static/instantiate/).

Метод створює і фіксує екземпляр класу в якості значення заданогї властивості. При спробі перевизначити властивість, замість самого перевизначення, екземпляр оновлюється. Таким чином досягається цілісність програми, зробленої на базі Matreshka.js.

> Метод є надбудовою над [`Matreshka#mediate`](/ua/api/matreshka/mediate/) і перевизначає медіатор.

Екземпляр класу створюється під час запуску методу ``instantiate``. Першим аргументом конструктора класу стає поточне значення властивості. У конструкторі класу необхідно передбачити те, що в нього потрапить або ``undefined`` (якщо властивість не містила до цього ніяких даних), або об'єкт, з яким треба щось зробити (наприклад, розширити екземпляр класу властивостями об'єкта).

> На ділі це виглядає просто: ви створюєте звичайний клас, який майже завжди приймає якісь дані, які потрібно обробити (наприклад, використовувати їх в методі [`Matreshka.Object#setData`](/ua/api/matreshka-object/set-data/)).

При спробі привласнити властивості інше значення, внутрішній механізм методу ``instantiate``, замість присвоювання, робить наступне:
- Якщо вказана функція ``updateCallback``, метод запускає його з двома аргументами: поточним значенням властивості і даними, які код намагається привласнити.
- Якщо заданий клас успадкований від [`Matreshka.Object`](/ua/api/matreshka-object/), екземпляр оновлюється новими даними, використовуючи метод [`Matreshka.Object#setData`](/ua/api/matreshka-object/set-data/) з прапором ``replaceData=true``.
- Якщо заданий клас успадкований від [`Matreshka.Array`](/ua/api/matreshka-array/), екземпляр оновлюється новими даними, використовуючи метод [`Matreshka.Array#recreate`](/ua/api/matreshka-array/recreate/).
- Якщо не вказана функція ``updateCallback`` і якщо класі не успадкований від [`Matreshka.Object`](/ua/api/matreshka-object/) або [`Matreshka.Array`](/ua/api/matreshka-array/), екземпляр розширюється властивостями об'єкта, який код намагається привласнити.

> Особливістю методу є відсутність обмежень на джерело класу. Класом може виступати будь-яка функція-конструктор. яка ініціалізується за допомогою оператора `` new``, а не тільки спадкоємці [`Matreshka`](/ua/api/matreshka/).

**Повертає:** [`object`](/ua/api/types/object/) – self

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `key` | [`string`](/ua/api/types/string/) \| [`array`](/ua/api/types/array/) | Ім'я властивості або масив імен властивостей |
| `class` | [`function`](/ua/api/types/function/) | Клас, чий екземпляр стає значенням властивості |
| `updateCallback` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, викликається при кожній спробі присвоїти чергові дані властивості, що дозволяє кастомізувати логіку поновлення екземпляра класу новими даними. Функція приймає два аргументи: поточне значення властивості (екземпляр класу) і дані, які намагаються привласнити. |

## Приклади

```js
class MyClass {
    // ...
}

// ...

this.instantiate('x', MyClass);

// намагаємося привласнити властивості інше значення
this.x = { a: 42 };

// this.x як і раніше екземпляр класу MyClass
alert(this.x instanceof MyClass); // true
alert(this.x.a); // 42
```

**Використання ``updateCallback``.**

```js
this.instantiate('x', MyClass, (instance, data) => {
	updateSomeHow(instance, data);
});
```

**Отримання батьківского об'єкту та імені властивості. Крім даних (перший аргумент), в конструктор створюваного класу, передається посилання на об'єкт, що викликав ``instantiate`` та ім'я створеної властивості**

```js
class MyClass extends Matreshka {
	constructor(data, parent, key) {
		super();
		// parent - це екземпляр MyParentClass,
        // який створив властивість
		// key - им'я властивості ("х")
	}
}

class MyParentClass extends Matreshka {
	constructor() {
		super().instantiate('x', MyClass);
	}
}
```

**Нестандартний спосіб використання ``updateCallback`` для ігнорування будь-яких змін властивості**

```js
this.instantiate('x', MyClass, () => {});
```

**У разі, якщо ваш клас не підтримує використання оператора ``new``, замість ``instantiate`` скористайтеся методом [`Matreshka#mediate`](/ua/api/matreshka/mediate/).**

```js
this.mediate('x', (data, currentValue) => {
	return currentValue instanceof SomeClass
		? Object.assign(currentValue, data)
		: SomeLib.initInstance(SomeClass, data);
});
```

**Абстрактний приклад з даними великий вкладеності (для лаконічності використовується синтаксис class instance fields)**

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

// дані можна серіалізувати та передати на сервер
JSON.stringify(app.appData);

// потім просто присвоїти чергові дані властивості appData
// при цьому, структура класів не зміниться
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

## Альтернативный синтаксис методу Matreshka#instantiate, який дозволяє приймати об'єкт ключ-клас в якості аргументу [#variation-2]

```js
Matreshka#instantiate(keyClassPairs, [updateCallback]) → object
```

**Повертає:** [`object`](/ua/api/types/object/) – self

### Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `keyClassPairs` | [`object`](/ua/api/types/object/) | Об'єкт з властивостями ключ-клас |
| `updateCallback` (необов'язковий) | [`function`](/ua/api/types/function/) | Функція, яка викликається при кожній спробі присвоїти нові данні властивості. |

### Приклади

```js
this.instantiate({
	x: Class1,
	y: Class2,
	z: Class3
}, (instance, data) => {
	instance.doSomethingWith(data);
});
```
