---
title: "Matreshka#calc"
sidebarTitle: "calc"
description: "Matreshka#calc: Створює залежність значення однієї властивості від значень інших"
importance: 1
---

# Matreshka#calc

**Метод** · Починаючи з версії 2.0

```js
Matreshka#calc(target, source, [handler=(v)=>v], [eventOptions])
```

Створює залежність значення однієї властивості від значень інших

Метод ``calc`` створює залежність значення властивості (аргумент ``target``) від значень інших властивостей (аргумент ``source``). При зміні ``source``, ``target`` обчислюється автоматично.

> Зверніть увагу, що у метода є [статичний аналог](/ua/api/matreshka-static/calc/), який працює в точності так само, але приймає будь-який об'єкт в якості першого аргументу, зсуваючи інші аргументи вправо.
```js
import { calc } from 'matreshka';
const object = {};
calc(object, target, source, handler, eventOptions);
// Замість this.calc(target, source, handler, eventOptions);
```

Аргумент ``source`` має кілька варіацій.

#### Строка

Властивість ``target`` буде залежати від властивості ``source``.

```js
this.b = 1;
this.calc('a', 'b', b => b * 2);
console.log(this.a); // 2
```

#### Масив строк

Властивість ``target`` буде залежати від властивостей, перерахованих в ``source``.

```js
this.b = 1;
this.c = 2;
this.d = 3;
this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d);
console.log(this.a); // 6
```

#### Об'єкт з властивостями ``object`` і ``key``

В цьому випадку можна оголосити залежність властивості ``target`` від іншого об'єкта.

```js
const someObject = { b: 1 };
this.calc('a', {
	object: someObject,
	key: 'b'
}, b => b * 2);

console.log(this.a); // 2
```

Значенням властивості ``key`` можна передати масив ключів.

```js
const someObject = {
	b: 1,
	c: 2,
	d: 3
};
this.calc ('a', {
	object: someObject,
	key: ['b', 'c', 'd']
}, (b, c, d) => b + c + d);

console.log(this.a); // 6
```

#### Масив об'єктів з властивостями ``object`` і ``key``

Так можна оголосити залежність властивості від властивостей різних об'єктів.

```js
const someObject = {
	b: 1,
	c: 2
};
const someObjectY = {
	d: 3
};

this.calc('a', [{
	object: someObject,
	key: ['b', 'c']
}, {
	object: someObjectY,
	key: 'd'
}], (b, c, d) => b + c + d);

console.log(this.a); // 6
```

#### Масив, що комбінує строки (власні властивості) і об'єкти

```js
this.b = 1;
this.c = 2;

const someObject = {
	d: 3,
	e: 4
};

this.calc('a', ['b', 'c', {
	object: someObject,
	key: ['d', 'e']
}], (b, c, d, e) => b + c + d + e);

console.log(this.a); // 10
```

З міркувань чистоти коду, комбінувати строки і об'єкти в масиві ``source`` не рекомендується. Замість строк краще передати об'єкт, у якого властивість ``object`` має значення цільового об'єкту. Приклад нижче робить те ж саме, що і попередній.

```js
this.b = 1;
this.c = 2;

const someObject = {
	d: 3,
	e: 4
};

this.calc('a', [{
	object: this, // цільовий об'єкт - це this
	key: ['b', 'c']
}, {
	object: someObject,
	key: ['d', 'e']
}], (b, c, d, e) => b + c + d + e);

console.log(this.a); // 10
```

#### Точка в імені властивості-джерела

Якщо ім'я ключа містить точку, метод ініціює залежність від властивості у вкладеному об'єкті.

```js
this.b = { c: { d: 1 } };
this.e = { f: { g: 2 } };

this.calc('a', ['b.c.d', 'e.f.g'], (d, g) => d + g);

console.log(this.a); // 3
```

Те ж саме стосується і зовнішніх об'єктів
```js
this.b = { c: { d: 1 } };
const someObject = { e: { f: { g: 2 } } };

this.calc('a', [{
	object: this
	key: 'b.c.d'
}, {
	object: someObject
	key; 'e.f.g'
}], (d, g) => d + g);

console.log(this.a); // 3
```

> Метод захищений від циклічних залежностей (наприклад a залежить від b, b залежить від c, а c залежить від a) і при помилці обчислень не блокує сторінку і не кидає виняток про переповнення стека.

Як ви могли помітити, аргументи функції ``handler`` завжди розташовані в тому ж порядку, що і властивості з ``source``.

У разі, якщо потрібно змінити значення властивості-джерела і зробити це так, щоб цільова властивість не була обчислена заново, використовуйте метод [`Matreshka#set`](/ua/api/matreshka/set/) з прапором ``skipCalc`` рівним ``true``.

```js
this.calc('a', 'b', handler);
this.set('b', newValue, {
    skipCalc: true
});
```

### Важливі особливості роботи методу і спеціальні прапори

Четвертим аргументом в метод ``calc`` можна передати об'єкт події ``eventOptions``, що містить спеціальні прапори, які описані нижче, прапори для методу ``set`` (наприклад, ``silent``), або кастомні дані, які передаються в обробники події ``change:KEY``.

```js
this.on('change:a', evt => {
	console.log(evt.foo); // 'bar'
});

this.calc('a', source, handler, { foo: 'bar' });
```

Якщо джерело змінюється з прапором ``silent``, ціль теж змінюється «тихо». Кастомні дані зміни джерела також потрапляють в обробники цілі. Прапори ``force``, ``forceHTML``, ``silentHTML`` і ``skipMediator`` зміни джерела на ціль не діють.

#### Прапор ``debounceCalc=true``
При виклику методу `` calc`` цільова властивість обчислюється без затримок, але при зміні властивості-джерела застосовується патерн debounce. Це означає, що цільова властивість зміниться через кілька мілісекунд і тільки один раз, навіть якщо властивості-джерела змінилися багаторазово за короткий проміжок часу.
```js
this.b = 1;
this.c = 2;
this.d = 3;

this.calc('a', ['b', 'c', 'd'], (b, c, d) => b + c + d);

this.on('change:a', () => {
	// Обробник буде викликаний один раз незважаючи на те,
	// що властивості-джерела змінилися тричі
	console.log(`a is changed to ${this.a}`); // a is changed to 60
});

this.b = 10;
this.c = 20;
this.d = 30;
console.log(this.a); // 6 замість 60
```
Для скасування debounce при зміні властивостей, тобто для включення моментального оновлення цільового властивості (як було в попередніх версіях методу), четвертим аргументом методу ``calc`` можна передати прапор ``debounceCalc`` рівний ``false``.

```js
this.b = 1;
this.c = 2;
this.d = 3;

this.calc ('a', ['b', 'c', 'd'], (b, c, d) => b + c + d, {
	debounceCalc: false
});

this.on('change: a', () => {
	// Обробник буде викликаний тричі,
	// кожен раз коли властивості b, c чи d змінюються

    // a is changed to ... 15, 33, 60
	console.log (`a is changed to $ {this.a}`);
});

this.b = 10;
this.c = 20;
this.d = 30;
console.log(this.a); // 60
```

#### Прапор ``debounceCalcOnInit=false``

Як говорилося вище, при виклику методу ``calc`` цільова властивість обчислюється відразу, а при зміні властивостей-джерел - ні. Увімкнути debounce і при першому обчисленні властивості можна передавши в якості властивості об'єкта події прапор ``debounceCalcOnInit=true``.

```js
this.on('change:a', () => {
	// Обробник буде викликаний один раз через невеликий проміжок часу
	console.log(`a is changed to $ {this.a}`); // a is changed to 6
});

this.b = 1;
this.c = 2;
this.d = 3;

this.calc ('a', ['b', 'c', 'd'], (b, c, d) => b + c + d, {
    debounceCalcOnInit: true
});

console.log(this.a); // undefined
```

На практиці ``debounceCalcOnInit`` навряд чи стане в нагоді. Потрібно лише пам'ятати, що є прапор який включає "повний debounce".

#### Прапор ``debounceCalcDelay=0``

Прапор дозволяє вказати затримку debounce при використанні ``debounceCalc`` і ``debounceCalcOnInit``.

#### Прапор ``setOnInit=true``

Відомо, що при виклику методу ``calc`` властивість відразу отримує нове значення. Для того, щоб скасувати цю поведінку і обчислити властивість ``target`` тільки тоді, коли властивість-джерело вперше змінено, використовуйте прапор ``setOnInit`` рівний ``false``.

```js
this.calc('a', 'b', b => b * 2, {
    setOnInit: false
});

console.log(this.a); // undefined

// Але якщо оновити this.b, для властивості a буде обчислено нове значення
this.b = 1;
```

#### Прапор ``exactKey=false``

Як говорилося вище, в якості імені властивості-джерела можна передати строку, що містить точки. Таке ім'я буде витлумачено як шлях до властивості у вкладеному об'єкті. У разі, якщо ім'я має бути використано як є, скористайтеся прапором ``exactKey`` зі значенням ``true``.

```js
this['foo.bar.baz'] = 1;
this.calc('a', 'foo.bar.baz', fooBarBaz => fooBarBaz * 2, {
    exactKey: true
});
console.log(this.a); // 2
```

#### Прапор ``promiseCalc=false``

Цей прапор дозволяє використовувати екземпляри ``Promise`` всередині функції, що обчислює значення. Значенням шуканої властивості стає результат успішного виконання промісу.

> Увага! ``Promise`` неможливо скасувати. Використовуйте можливість ``promiseCalc`` акуратно та не допускайте багаторазового виклику складних функцій.

Якщо джерела змінюються знову до того, як проміс виконається, ціль встановлює тільки останнє обчислення: результати попередніх відкидаються.

```js
this.calc('a', ['b', 'c'], (b, c) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(a + b)
		}, 1000);
	});
}, {
	promiseCalc: true
});

this.b = 1;
this.c = 2;

// "a" буде змінений через секунду
```

```js
this.calc('response', 'data', async (data) => {
	const resp = await fetch(url, {
		method: 'post',
		body: data
	});

	return resp.json();
}, {
	promiseCalc: true
});
```

## Аргументи

| Ім'я | За замовчуванням | Тип | Опис |
| --- | --- | --- | --- |
| `target` |  | [`string`](/ua/api/types/string/) | Ім'я властивості яка залежить від інших властивостей |
| `source` |  | [`string`](/ua/api/types/string/) \| [`array`](/ua/api/types/array/) | Від яких властивостей залежить шукана властивість (див. опис вище) |
| `handler` (необов'язковий) | `(v)=>v` | [`function`](/ua/api/types/function/) | Функція, що повертає нове значення |
| `eventOptions` (необов'язковий) |  | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт, в який можна передати якісь дані для обробника події, який слухає зміни ``target`` або спеціальні прапори (див. опис методу) |

## Приклади

```js
this.calc('greeting', 'name', name => `Hello, ${name}!`);

this.name = 'World';

// ... in a moment
alert(this.greeting); // 'Hello, World!'
```

**Обчислення периметра прямокутника по двох сторонах (і сторін по периметру)**

```js
this.a = 3;
this.b = 4;

this
    .calc('p', ['a', 'b'], (a, b) => (a + b) * 2)
    .calc('a', ['p', 'b'], (p, b) => p / 2 - b)
    .calc('b', ['p', 'a'], (p, a) => p / 2 - a);

alert(this.p); // 14

this.on('change: p', () => {
    // "периметр змінений і дорівнює 18"
    console.log(`периметр змінений і дорівнює ${this.p}`);
});

this.a = 5;
```

## Додаткова можливість методу Matreshka#calc, що дозволяє оголосити кілька обчислюваних властивостей одним викликом [#variation-batch]

```js
Matreshka#calc(batch, [commonEventOptions])
```

Перший аргумент - об'єкт, ключі якого - імена властивостей, які потрібно обчислювати, а значення - об'єкти, що містять:

- ``source`` - властивості, від яких залежить цільова властивість;
- ``handler`` - як саме буде обчислена властивість (за замовчуванням дорівнює ``(value) => value``);
- ``event`` - об'єкт події (не обов'язково).

Другий аргумент - загальний об'єкт події, що розширює ``event`` для кожної шуканої властивості (властивості з ``event`` мають більший приоритет).

``source`` може приймати будь-який вид [опис вище](/ua/api/matreshka/calc/) (рядок, масив рядків, об'єкт з властивостями ``key`` і ``object``, масив таких об'єктів).

### Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `batch` | [`array`](/ua/api/types/array/) | Об'єкт містить інформацію про обчислюваних властивості |
| `commonEventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Загальні властивості для об'єктів події |

### Приклади

```js
this.calc({
	x: {
    	source: ['a', 'b'],
    	handler: (a, b) => a + b
	},
	y: {
	    source: {
	        object: someObject,
	        key: 'c'
	    },
	    event: {
	        setOnInit: false
	    }
	},
	z: {
	    source: [{
	        object: this,
	        key: 'x'
	    }, {
	        object: someObject,
	        key: 'd'
	    }],
	    handler: (x, d) => x + d
	}
}, {
    debounceCalc: false
});
```
