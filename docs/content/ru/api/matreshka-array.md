---
title: "Matreshka.Array"
asIndexPage: true
description: "Matreshka.Array: Класс Matreshka.Array служит коллекцией во фреймворке Matreshka.js. Он наследуется от класса Matreshka и включает все его свойства и методы…"
importance: 1
---

# Matreshka.Array

**Класс** · extends `Matreshka`

**Импорт:**

```js
import { MatreshkaArray } from 'matreshka';
```

Класс ``Matreshka.Array`` служит коллекцией во фреймворке Matreshka.js. Он наследуется от класса [`Matreshka`](/ru/api/matreshka/) и включает все его свойства и методы. Кроме этого, ``Matreshka.Array`` имеет все методы, которые есть у обычного массива, тем самым упрощая изучение его возможностей.

#### Все методы, позаимствованные у встроенного Array работают аналогично их оригиналам

Программист, знакомый с методами нативного ``Array`` сразу может понять, каким методом можно добавить элемент (``push``, ``unshift``, ``splice``), каким удалить (``pop``, ``shift``, ``splice``), каким отсортировать (``sort``, ``reverse``) и т. д.

По причине того, что методы работают так же, как и оригинальные (с небольшими исключениями), они не приведены в этой документации по отдельности, а выведены в раздел [`Matreshka.Array#METHOD`](/ru/api/matreshka-array/method/).
```js
this.push(1, 2, 3);
this.pop();
```

#### Все методы, позаимствованные у встроенного Array, которые модифицируют массив могут быть вызваны с передачей объекта события

Для этого используется синтаксис ``метод_``, где нижнее подчеркивание в конце имени метода означает, что последним аргументом является объект события. Такие методы не приведены в этой документации, так как требуется запомнить только их синтаксис. См.  [`Matreshka.Array#METHOD_`](/ru/api/matreshka-array/method-silent/).
```js
this.push_(1, 2, 3, {
	silent: true
});

this.pop_({
	foo: 'bar'
});
```

#### Разработчик имеет возможность отлавливать любые модификации данных

__При использовании методов, позаимствованных у встроенного ``Array`` генерируются события с соответствующим именем.__ Вызывая метод ``push``, генерируется событие ``push``, вызывая метод ``shift`` генерируется событие ``shift``, вызывая метод ``sort``, генерируется событие ``sort`` и так далее.
```js
this.on('push', evt => {
	console.log('push is called');
});

this.push(1, 2, 3);
```

__При добавлении элементов генерируются события ``add`` и ``addone``.__ Первое генерируется один раз на добавление (например, вы добавили несколько элементов с помощью ``push``, событие вызвалось только один раз), второе генерируется один раз на каждый добавленный элемент.

При срабатывании события ``add``, значением свойства  ``added`` объекта события передается массив добавленных элементов, а при срабатывании ``addone``, значением свойства ``addedItem`` - каждый отдельный добавленный элемент.

```js
this.on('add', evt => {
	console.log(evt.added); // [1,2,3]
});

this.push(1, 2, 3);
```
```js
// обработчик запустится трижды,
// так как в массив добавили три новых элемента
this.on('addone', evt => {
	console.log(evt.addedItem); // 1 ... 2 ... 3
});

this.push(1, 2, 3);
```

__При удалении элементов действует та же логика__: ``remove`` срабатывает один раз, даже если удалено несколько элементов, а событие ``removeone`` срабатывает для каждого удаленного элемента индивидуально. При генерации события ``remove`` удаленные элементы содержатся в свойстве ``removed`` объекта события, а при генерации события ``removeone`` - каждый удаленный элемент содержится в свойстве ``removedItem``.

```js
this.push(1, 2, 3, 4, 5);

this.on('remove', evt => {
	console.log(evt.removed); // [2, 3, 4]
});

this.splice(1, 3);
```
```js
this.push(1, 2, 3, 4, 5);

// обработчик запустится трижды,
// так как из массива удалили три элемента
this.on('removeone', evt => {
	console.log(evt.removedItem); // 2 ... 3 ... 4
});

this.splice(1, 3);
```

__При каждой модификации массива генерируется событие ``modify``__, позволяя отловить все без исключения изменения в массиве (добавление, удаление, пересортировку).
```js
this.on('modify', evt => {
	console.log(evt.added);
	console.log(evt.removed);
});
```

__``length`` - это обычное свойство__ которое можно связывать с HTML элементом или отлавливать изменения с помощью события ``change:length``.

> Например, при добавлении трех элементов с помощью метода ``push`` с тремя аргументами, генерируются следующие события: ``push``, ``add``, ``addone`` (трижды), ``modify``, ``change:length``.

#### Model
Свойство [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/) определяет класс элементов, которые будет содержать коллекция. Рекомендуется наследовать ``Model`` от класса [`Matreshka.Object`](/ru/api/matreshka-object/) или [`Matreshka.Array`](/ru/api/matreshka-array/) (на случай, если требуется получить коллекцию коллекций), чтобы получить возможность конвертации массива в обычный массив рекурсивно методом [`Matreshka.Array#toJSON`](/ru/api/matreshka-array/to-json/).

#### Автоматический рендеринг
``Matreshka.Array`` умеет автоматически отрисовывать элементы на странице при любых модификациях массива. За подробностями обратитесь к документации [`Matreshka.Array#itemRenderer`](/ru/api/matreshka-array/item-renderer/).

## Ссылки

- [`Matreshka.Array#itemRenderer`](/ru/api/matreshka-array/item-renderer/)
- [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/)

## Примеры

**Создание экземпляра с нулевой длиной**

```js
new Matreshka.Array();
```

**Создание экземпляра с указанием длины**

```js
new Matreshka.Array(42);
```

Как и нативный ``Array``, одно число, не являющееся допустимой длиной (отрицательное, дробное или ``NaN``), бросает ``RangeError``.

**Передача элементов при создании**

```js
new Matreshka.Array('Hi', { a: 'b' });
```

**Наследование**

```js
class MyClass extends Matreshka.Array {
	constructor(items) {
		super(...items).sayHello();
	}
	sayHello() {
		alert("Hello World!");
	}
}
```

**Наследование, используя функцию [`Matreshka.Class`](/ru/api/matreshka-static/class/)**

```js
const MyClass = Matreshka.Class({
	extends: Matreshka.Array,
	constructor(items) {
		this.recreate(items).sayHello();
	},
	sayHello() {
		alert("Hello World!");
	}
});
```

## Методы и свойства

- [`METHOD`](/ru/api/matreshka-array/method/) – Любой метод из ``Array.prototype``
- [`METHOD_`](/ru/api/matreshka-array/method-silent/) – Любой метод из ``Array.prototype`` с возможностью передать объект события
- [`Model`](/ru/api/matreshka-array/model/) – Свойство определяет класс элементов, которые будет содержать коллекция
- [`isMatreshkaArray`](/ru/api/matreshka-array/is-matreshka-array/) _(Для продвинутых)_ – ``isMatreshkaArray`` всегда равен ``true`` для экземпляров [`Matreshka.Array`](/ru/api/matreshka-array/)
- [`itemRenderer`](/ru/api/matreshka-array/item-renderer/) – HTML строка, селектор или функция, отвечающая за отрисовку элементов массива на странице
- [`mediateItem`](/ru/api/matreshka-array/mediate-item/) – Трансформирует значение элементов массива
- [`onItemRender`](/ru/api/matreshka-array/on-item-render/) – Функция, которая запускается перед событием ``render``.
- [`orderBy`](/ru/api/matreshka-array/order-by/) – Сортирует массив по значениям свойств объектов, которые в него входят
- [`pull`](/ru/api/matreshka-array/pull/) – Удаляет элемент по индексу или по значению
- [`recreate`](/ru/api/matreshka-array/recreate/) – Пересоздает экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/)
- [`renderIfPossible`](/ru/api/matreshka-array/render-if-possible/) _(Для продвинутых)_ – Свойство ``renderIfPossible`` отменяет рендеринг массива если имеет значение ``false``
- [`rerender`](/ru/api/matreshka-array/rerender/) _(Для продвинутых)_ – Перерисовывает DOM узлы элементов, входящих в массив
- [`restore`](/ru/api/matreshka-array/restore/) – Воссоздаёт [`Matreshka.Array`](/ru/api/matreshka-array/) из HTML узлов на странице.
- [`toJSON`](/ru/api/matreshka-array/to-json/) – Конвертирует экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/) в обычный массив
- [`trackBy`](/ru/api/matreshka-array/track-by/) – Свойство ``trackBy`` указывает на имя свойства идентификатора объектов, входящих в массив
- [`from`](/ru/api/matreshka-array/from/) – Метод создаёт новый экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/) из массивоподобного или итерируемого объекта
- [`of`](/ru/api/matreshka-array/of/) – Метод создаёт новый экземпляр [`Matreshka.Array`](/ru/api/matreshka-array/) из произвольного числа агрументов, вне зависимости от числа или типа аргумента
