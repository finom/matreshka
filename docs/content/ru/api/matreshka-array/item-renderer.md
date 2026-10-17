---
title: "Matreshka.Array#itemRenderer"
sidebarTitle: "itemRenderer"
description: "Matreshka.Array#itemRenderer: HTML строка, селектор или функция, отвечающая за отрисовку элементов массива на странице"
importance: 1
---

# Matreshka.Array#itemRenderer

**Свойство** · Определяется вами

```js
Matreshka.Array#itemRenderer: string|function
```

HTML строка, селектор или функция, отвечающая за отрисовку элементов массива на странице

Свойство ``itemRenderer`` - это переопределяемое (виртуальное) свойство, которое позволяет рендерить элементы массива без дополнительного кода. При вставке нового элемента в массив, автоматически создается HTML узел. Этот узел становится песочницей (см. [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)) (это поведение можно отменить, см. ниже) для вставленного элемента и встраивается в HTML контейнер, определенный в массиве.

> Для краткости, в примерах к этой статье будет использоваться синтаксис class fields.

> ``itemRenderer`` и ``Model`` работают и как поля класса, и как геттеры; новое значение поля ``itemRenderer`` перерендеривает элементы. Об элементах, переданных в ``super(...)``, см. [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/).

#### Куда вставляется созданный элемент?
Для того, чтобы определить место, в которое будут вставляться отрисованные HTML узлы, нужно определить **контейнер**. Для этого следует объявить HTML песочницу для массива либо связать специальный ключ ``container`` с HTML контейнером. Подробнее о привязках и песочнице см. [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/).
Пример использования песочницы в качестве контейнера:
```html
<ul class="my-list"></ul>
```
```js
class MyArray extends Matreshka.Array {
	itemRenderer = '<li>';
	get Model() { return MyModel; }
	constructor() {
        super();
		// определяем песочницу
		this.bindNode('sandbox', '.my-list');
	}
}
```
Теперь все новосозданные узлы ``<li>`` попадут в узел ``.my-list``

Если вы не хотите вставлять HTML узлы непосредственно в песочницу, можете связать ключ ``container`` с необходимым элементом. Такая логика нужна в том случае, если песочница не ограничена одними лишь элементами коллекции и включает в себя другие HTML узлы.
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
		// определяем песочницу
		this.bindNode('sandbox', '.my-widget');
		// определяем контейнер для HTML элементов
		this.bindNode('container', '.my-list');
	}
}
```
В примере выше HTML узлы будут вставляться в ``.my-list`` вместо ``.my-widget``.

Свойство ``itemRenderer`` поддерживает несколько вариантов определения, но все они должны содержать или возвращать единственный HTML узел.

#### HTML строка в качестве значения свойства
Как видно из примера выше, ``itemRenderer`` может быть определен, как HTML строка.
```js
class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = '<div class="my-div">foo</div>';
	constructor() { ... }
}
```
#### Селектор в качестве значения свойства
На случай, если вы выносите шаблоны для элементов на HTML страницу, ``itemRenderer`` поддерживает селектор в качестве значения. В этом случае, [`Matreshka.Array`](/ru/api/matreshka-array/) будет искать HTML элемент в DOM дереве и извлечет ``innerHTML`` найденого элемента. В случае, если элемент не найден, бросается исключение.

> HTML текст от селектора отличается наличием  символа ``<`` в строке.

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
#### Функция в качестве значения свойства
Использование функции в качестве значения свойства ``itemRenderer`` может пригодиться, когда есть нужда динамически генерировать элемент для рендеринга. Функция может возвращать:

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

__DOM узел__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return document.createElement('div');
	}
}
```

#### Перекрытие родительского рендерера свойством ``render``
Иногда удобно объявлять рендерер внутри класса [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/), а не на уровне коллекции. Свойство ``renderer`` перекрывает значение ``itemRenderer``, если оно задано для элемента коллекции.
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
В этом случае, можно вовсе не указывать ``itemRenderer``, так как ``render`` дочернего элемента перенимает все его возможности. Синтаксис остаётся такими же: можно использовать HTML, селектор или функцию.

#### Событие ``render`` и ``afterrender``
После того, как объект вставлен в массив, а его HTML узел уже создан, но еще не вставлен в контейнер, генерируется событие ``render`` на вставленном элементе. После его генерации можно объявить привязки свойств к HTML узлам, содержащимся внутри этого элемента.

``afterrender``, в свою очередь, генерируется после вставки HTML элемента в контейнер массива.

```html
<form class="my-form"></form>
```
```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);

		// ждем генерации события
		this.on('render', () => {
            // объявляем байндинги
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
Код выше создаст такое HTML дерево:
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
И свяжет чекбоксы с соответствующими свойствами ``isChecked`` и ``text``.

Не забывайте, что в Matreshka.js реализована возможность отлова делегированных событий. Т. е. сам массив может отловить событие рендеринга элемента, используя имя события ``*@render`` (см. документацию к [`eventNames`](/ru/api/types/event-names/)).
```js
this.on('*@render', () => {
	alert('Child element is rendered');
});
```

> Отрисованный HTML узел становится песочницей для вставленного элемента, позволяя использовать селектор ``:sandbox`` и другие возможности после рендеринга. Если элемент входит сразу в несколько коллекций, установите ему свойство ``bindRenderedAsSandbox: false``, чтобы отменить это поведение.
```js
class MyModel extends Matreshka.Object {
	bindRenderedAsSandbox = false;
	// ...
}
```

#### ``onItemRender`` и ``onRender``
Для улучшения читаемости кода в одной из предыдущих версий появился виртуальный метод [`Matreshka.Array#onItemRender`](/ru/api/matreshka-array/on-item-render/), который можно использовать вместо события ``render``. В качестве альтернативы, у "моделей" вызывается метод ``onRender``, так же позволяющий сделать код более "плоским" и избавиться от вложенных функций.

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
		super();
		//...
	}
	onItemRender(item, evt) {
		//...
	}
}

const app = new MyArray();
```

#### Шаблонизатор
Взглянув на примеры использования [`Matreshka.Array`](/ru/api/matreshka-array/) и [`Matreshka.Array#itemRenderer`](/ru/api/matreshka-array/item-renderer/) можно обратить внимание на то, что вся логика, отвечающая за двустороннюю и одностороннюю привязку данных заключена в JavaScript коде. Но когда разрабатываешь очень простую коллекцию, не включающую в себя сложную логику, массу привязок и пр. хотелось бы иметь более краткий вариант объявления привязок. Для этого, в ``itemRenderer`` может быть передан шаблон, включающий привязки, заключенные в фигурные скобки (см. [`Matreshka#parseBindings`](/ru/api/matreshka/parse-bindings/)).

```js
class MyArray extends Matreshka.Array {
	itemRenderer = `<label>
		<input type="checkbox" checked="{{isChecked}}">{{text}}
	</label>`;
	// ...
}

const app = new MyArray();
```

#### Отмена рендеринга
Как видно выше, если у дочернего элемента задано свойство ``render``, ``Matreshka.Array`` попробует его отрисовать. Для того, чтоб полностью отменить рендеринг для массива, присвойте свойству массива ``renderIfPossible`` значение ``false``.
```js
class MyArray extends Matreshka.Array {
	renderIfPossible = false;
	// ...
}
```

#### Перемещение объекта из одного массива в другой
По умолчанию, при вставке объекта в массив фреймворк попытается его отрисовать, используя ``itemRenderer``. Это даёт преимущество в случаях, когда у вас на странице есть два или более списка, включающих в себя один и тот же объект. При изменении этого объекта, все списки моментально реагируют на изменение, обновляя DOM.

Но иногда стоит задача перемещения объекта между коллекциями, не перерисовывая его заново. Для перемещения объекта из одного массива в другой, включая его песочницу, используйте флаг ``moveSandbox``.
```js
this.push_(item, {
	moveSandbox: true
});
```

#### Переопределение ``itemRenderer``
При переустановке свойства ``itemRenderer``, коллекция автоматически перерисовывается.
```js
this.itemRenderer = '<div>';
```
Эта возможность полезна в том случае, когда разработчик желает загрузить шаблон с сервера.
```js
fetch('templates/template.html')
	.then(resp => resp.text())
	.then(data => {
		this.itemRenderer = data;
	});
```

Для отрисовки только тех объектов, которые еще не были отрисованы, воспользуйтесь методом [`Matreshka#set`](/ru/api/matreshka/set/) с флагом ``forceRerender`` со значением  ``false``
```js
this.set('itemRenderer', renderer, {
	forceRerender: false
});
```
Такая необходимость может возникнуть тогда, когда вы используете серверный пререндеринг (см. [`Matreshka.Array#restore`](/ru/api/matreshka-array/restore/)), а шаблон подгружается динамически.
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

#### Рендеринг коллекции, состоящей из обычных объектов

Объект, входящий в коллекцию, не обязательно должен быть экземпляром ``Matreshka``, можно рендерить любой объект. Байндинги для таких объектов можно объявить используя статичный метод [`Matreshka.bindNode`](/ru/api/matreshka-static/bind-node/).

```js
class MyArray extends Matreshka.Array {
	// Model не определена
	itemRenderer = ...;
	onItemRender(item) {
		Matreshka.bindNode(item, 'x', ':sandbox .some-node');
	}
}
```

Еще небольшой пример: рендеринг простого списка.
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

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `item` | [`object`](/ru/api/types/object/) | объект, который будет рендериться (на случай необходимости определения условий для рендеринга разных элементов в разных случаях) |

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [`Matreshka.Array#Model`](/ru/api/matreshka-array/model/)
