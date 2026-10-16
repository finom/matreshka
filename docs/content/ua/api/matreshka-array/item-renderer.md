---
title: "Matreshka.Array#itemRenderer"
sidebarTitle: "itemRenderer"
description: "Matreshka.Array#itemRenderer: HTML строка, селектор або функція, яка відповідає за рендерінг элементів масива на сторінці"
importance: 1
---

# Matreshka.Array#itemRenderer

**Властивість** · Визначається вами

```js
Matreshka.Array#itemRenderer: string|function
```

HTML строка, селектор або функція, яка відповідає за рендерінг элементів масива на сторінці

Властивість ``itemRenderer`` - це перевизначаєма (віртуальна) властивість, яка дозволяє рендерити айтеми масиву без додаткового коду. При вставці нового об'єкта в масив, автоматично створюється HTML елемент. Цей елемент стає пісочницею (див. [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)) (цю поведінку можна скасувати, див. нижче) для вставленого об'єкта і вставляється в HTML контейнер, визначений у масиві.

> Для скорочення, в прикладах до цієї статті буде використовуватися синтаксис class fields.

> ``itemRenderer`` і ``Model`` працюють і як поля класу, і як геттери; нове значення поля ``itemRenderer`` перерендерює елементи. Про елементи, передані в ``super(...)``, див. [`Matreshka.Array#Model`](/ua/api/matreshka-array/model/).

#### Куди вставляється створений елемент?
Для того, щоб визначити місце, в яке будуть вставлятися відмальовані HTML вузли, потрібно визначити **контейнер **. Для цього слід оголосити HTML пісочницю для масиву або зв'язати спеціальний ключ ``container`` з HTML контейнером. Детальніше про привязки і пісочницю див. [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/).
Приклад використання пісочниці як контейнера:
```html
<ul class="my-list"></ul>
```
```js
class MyArray extends Matreshka.Array {
	itemRenderer = '<li>';
	get Model() { return MyModel; }
	constructor() {
        super();
		// визначаємо пісочницю
		this.bindNode('sandbox', '.my-list');
	}
}
```
Тепер всі новостворені елементи ``<li>`` попадуть у елемент ``.my-list``.

Якщо ви не хочете вставляти HTML елементи безпосередньо в пісочницю, можете пов'язати ключ ``container`` з необхідним контейнером. Така логіка потрібна в тому випадку, якщо пісочниця не обмежена одними лише елементами колекції і включає в себе інші HTML елементи.
```html
<div class="my-widget">
	<h1>This is my awesome list</h1>
	<ul class="my-list"></ul>
</div>
```
```js
class MyArray extends Matreshka.Array {
	itemRenderer = '<li>';
	get Model() { return MyModel; }
	constructor() {
        super();
		// визначаємо пісочницю
		this.bindNode('sandbox', '.my-widget');
		// визначаємо контейнер для HTML элементів
		this.bindNode('container', '.my-list');
	}
}
```
В наведеному вище прикладі HTML вузли попадуть в ``.my-list`` замість ``.my-widget``.

Властивість ``itemRenderer`` підтримує кілька варіантів визначення, але всі вони повинні містити або повертати єдиний HTML вузол.

#### HTML строка в якості значення властивості
Як видно з прикладу вище, ``itemRenderer`` може бути визначений, як HTML строка.
```js
class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = '<div class="my-div">foo</div>';
	constructor() { ... }
}
```
#### Селектор в якості значення властивості
На випадок, якщо ви виносите шаблони для елементів на HTML сторінку, ``itemRenderer`` підтримує селектор в якості значення. У цьому випадку, [`Matreshka.Array`](/ua/api/matreshka-array/) буде шукати HTML елемент в DOM дереві і витягне ``innerHTML`` знайденого елемента. У разі, якщо елемент не знайдений, кидається виняток.

> HTML текст від селектора відрізняється наявністю символу ``<``.

```html
<script type="text/html" id="my-template">
	<div class="my-div">foo</div>
</script>
```
```js
class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = '#my-template';
	constructor() { ... }
}
```
#### Функція як значення властивості
Використання функції в якості значення властивості ``itemRenderer`` може стати в нагоді, коли є потреба динамічно генерувати елемент для рендеринга. Функція може повертати:

__HTML строку__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return '<div class="my-div">foo</div>';
	}
}
```

__Селектор__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return '#my-template';
	}
}
```

__DOM вузол__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return document.createElement('div');
	}
}
```

#### Перекриття батьківського рендерера властивістю ``render``
Іноді зручно оголошувати рендерер в класі [`Matreshka.Array#Model`](/ua/api/matreshka-array/model/), а не на рівні колекції. Властивість ``renderer`` перекриває значення ``itemRenderer``, якщо вона задана для елемента колекції.
```js
class MyModel extends Matreshka.Object {
	renderer = '<div class="my-div">foo</div>';
}

class MyArray extends Matreshka.Array {
	Model = MyModel;
	itemRenderer = '<frameset>bar</frameset>';
	constructor() { ... }
}
```
В цьому випадку, можна зовсім не вказувати ``itemRenderer``, так як ``render`` дочірнього елемента переймає всі його можливості. Синтаксис залишається таким же: можна використовувати HTML, селектор або функцію.

#### Події ``render`` та ``afterrender``
Після того, як об'єкт вставлений в масив, а його HTML елемент вже створений, але ще не вставлений в контейнер, генерується подія ``render`` на вставленому об'єкті. Після його генерації можна оголосити прив'язки властивостей до HTML вузлів, що містяться всередині цього елемента.

``afterrender``, в свою чергу, генерирується після вставки HTML элемента в контейнер масива.

```html
<form class="my-form"></form>
```
```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);

		// чекаємо на генерацію події
		this.on('render', () => {
            // оголошуємо біндінги
			this.bindNode('isChecked', ':sandbox .my-checkbox');
			this.bindNode('text', ':sandbox .text',
				Matreshka.binders.html());
		});
	}
}

class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = `<label>
		<input type="checkbox" class="my-checkbox">
		<span class="text"></span>
	</label>`;
	constructor() {
        super();
		this.bindNode('sandbox', '.my-form');
		this.push({
			isChecked: true,
			text: 'Buy a raccoon'
		}, {
			isChecked: false,
			text: 'Sell the raccoon'
		});
	}
}

const app = new MyArray();
```
Код вище створить таке HTML дерево:
```html
<form class="my-form">
	<label>
		<input type="checkbox" class="my-checkbox">
		<span class="text">Buy a raccoon</span>
	</label>
	<label>
		<input type="checkbox" class="my-checkbox">
		<span class="text">Sell the raccoon</span>
	</label>
</form>
```
І зв'яже чекбокси з відповідними властивостями ``isChecked`` і ``text``.

Не забувайте, що в Matreshka.js реалізована можливість вилову делегованих подій. Тобто сам масив може відловити подію рендеринга айтема, використовуючи ім'я події ``*@render`` (див. документацію до [`eventNames`](/ua/api/types/event-names/)).
```js
this.on('*@render', () => {
	alert('Child element is rendered');
});
```

> HTML елемент стає пісочницею для вставленого об'єкту дозволяючи використовувати селектор ``:sandbox`` і інші можливості після рендеринга. Якщо об'єкт входить відразу в кілька колекцій, встановіть йому властивість ``bindRenderedAsSandbox: false``, щоб скасувати цю поведінку.
```js
class MyModel extends Matreshka.Object {
	bindRenderedAsSandbox = false;
	// ...
}
```

#### ``onItemRender`` та ``onRender``
Для поліпшення коду в одній з попередніх версій з'явився віртуальний метод [`Matreshka.Array#onItemRender`](/ua/api/matreshka-array/on-item-render/), який можна використовувати замість події ``render``. В якості альтернативи, у "моделей" викликається метод ``onRender``, що так само дозволяє зробити код більш "плоским" і позбутися вкладених функцій.

```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
	onRender(evt) {
		this.bindNode('isChecked', ':sandbox .my-checkbox');
		this.bindNode('text', ':sandbox .text',
				Matreshka.binders.html());
	}
}

class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = '...';
	constructor() {
		//...
	}
	onItemRender(item, evt) {
		//...
	}
}

const app = new MyArray();
```

#### Шаблонізатор
Поглянувши на приклади використання [`Matreshka.Array`](/ua/api/matreshka-array/) і [`Matreshka.Array#itemRenderer`](/ua/api/matreshka-array/item-renderer/) можна звернути увагу на те, що вся логіка, що відповідає за двосторонню і односторонню прив'язку даних укладена в JavaScript коді. Але коли розробляєш дуже просту колекцію, яка не включає в себе складну логіку, масу прив'язок та ін. хотілося б мати більш короткий варіант оголошення прив'язок. Для цього, в ``itemRenderer`` може бути переданий шаблон, що включає прив'язки, укладені у фігурні дужки (див. [`Matreshka#parseBindings`](/ua/api/matreshka/parse-bindings/)).

```js
class MyArray extends Matreshka.Array {
	itemRenderer = `<label>
		<input type="checkbox" checked="{{isChecked}}">{{text}}
	</label>`;
	// ...
}

const app = new MyArray();
```

#### Скасування рендеринга
Як видно вище, якщо у дочірнього елемента задано властивість ``render``, ``Matreshka.Array`` спробує його змалювати. Для того, щоб повністю скасувати рендеринг для масиву, надайте властивості масиву ``renderIfPossible`` значення ``false``.
```js
class MyArray extends Matreshka.Array {
	renderIfPossible = false;
	// ...
}
```

#### Переміщення об'єкта з одного масиву в інший
За замовчуванням, при вставці об'єкта в масив Matreshka.js спробує його змалювати, використовуючи ``itemRenderer``. Це дає перевагу у випадках, коли у вас на сторінці є два або більше контейнерів, що включають в себе елементи прив'язані до одного і того же об'єкту. При зміні об'єкта, всі елементи реагують на зміну, оновлюючи DOM.

Але іноді стоїть завдання переміщення об'єкта між колекціями, не перемальовуючи його заново. Для переміщення об'єкта з одного масиву в інший, включаючи його пісочницю, використовуйте прапор ``moveSandbox``.
```js
this.push_(item, {
	moveSandbox: true
});
```

#### Перевизначення ``itemRenderer``
При перевизначенні властивості ``itemRenderer``, колекція автоматично перемальовується.
```js
this.itemRenderer = '<div>';
```
Ця можливість корисна в тому випадку, коли розробник бажає завантажити шаблон з сервера.
```js
fetch('templates/template.html')
	.then(resp => resp.text())
	.then(data => {
		this.itemRenderer = data;
	});
```

Для рендеринга тільки тих об'єктів, які ще не були намальовані, скористайтеся методом [`Matreshka#set`](/ua/api/matreshka/set/) з прапором ``forceRerender`` зі значенням ``false``

```js
this.set('itemRenderer', renderer, {
	forceRerender: false
});
```
Така необхідність може виникнути тоді, коли ви використовуєте серверний пререндерінг (див. [`Matreshka.Array#restore`](/ua/api/matreshka-array/restore/)), а шаблон завантажується динамічно.
```js
class MyArray extends Matreshka.Array {
	constructor() {
		super()
			.bindNode('sandbox', '.some-node')
			.restore();

		fetch('templates/template.html')
			.then(resp => resp.text())
			.then(data => {
				this.set('itemRenderer', data, {
					forceRerender: false
				});
			});
	}
}
```

#### Рендерінг колекції, що складається зі звичайних об'єктів

Об'єкт, що входить в колекцію, не обов'язково повинен бути екземпляром ``Matreshka``, можна рендерити будь-який об'єкт. Байндінги для таких об'єктів можна оголосити використовуючи статичний метод [`Matreshka.bindNode`](/ua/api/matreshka-static/bind-node/).

```js
class MyArray extends Matreshka.Array {
	// Model не визначена
	itemRenderer = ...;
	onItemRender(item) {
		Matreshka.bindNode(item, 'x', ':sandbox .some-node');
	}
}
```

Ще невеликий приклад: рендеринг простого списку.
```js
class MyArray extends Matreshka.Array {
	itemRenderer = '<li>{{value}}</li>';
	constructor() {
		super().bindNode('sandbox', '.my-list');
	}
}

const arr = new MyArray();
arr.push({ value: 'Item 1' }, { value: 'Item 2' });
```

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `item` | [`object`](/ua/api/types/object/) | об'єкт, який буде рендериться (на випадок необхідності визначення умов для рендеринга різних елементів в різних випадках) |

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [`Matreshka.Array#Model`](/ua/api/matreshka-array/model/)
