---
title: "Matreshka.Array#itemRenderer"
sidebarTitle: "itemRenderer"
description: "Matreshka.Array#itemRenderer: HTML string, a selector or a function which is responsible for rendering DOM nodes of an array on a page"
importance: 1
---

# Matreshka.Array#itemRenderer

**Property** · Defined by you

```js
Matreshka.Array#itemRenderer: string|function
```

HTML string, a selector or a function which is responsible for rendering DOM nodes of an array on a page

The ``itemRenderer`` overridable property allows to render corresponded HTML nodes of items of an array without a programmer's participation. On a new item insertion into an array, HTML node is created automatically. This node becomes a sandbox (see. [`Matreshka#bindNode`](/api/matreshka/bind-node/)) (this behavior can be canceled, read below) for inserted item and it is inserted into HTML container which is defined in an array.

> For brevity, the "class fields" syntax will be used in examples at this article.

> ``itemRenderer`` and ``Model`` work as class fields as well as getters; assigning a new value to an ``itemRenderer`` class field rerenders the items. See [`Matreshka.Array#Model`](/api/matreshka-array/model/) about the items passed to ``super(...)``.

#### Where is created node inserted?
In order to define a place where rendered HTML nodes will be inserted, it is necessary to define a **container**. HTML sandbox should be declared for an array or a special ``container`` key should be bound to the HTML container for that.  Read more detailed information about bindings and sandboxes in [`Matreshka#bindNode`](/api/matreshka/bind-node/).

Rendering to a sandbox:
```html
<ul class="my-list"></ul>
```
```js
class MyArray extends Matreshka.Array {
	itemRenderer = '<li>';
	get Model() { return MyModel; }
	constructor() {
		// sandbox definition
		super().bindNode('sandbox', '.my-list');
	}
}
```
Now all newly created ``<li>``  nodes will get into the ``.my-list`` node.

If you do not want to insert HTML nodes straight into the sandbox, you can bind ``container`` property to needed HTML node. This logic is required in case if a sandbox is not limited by collection items and it includes other HTML nodes.
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
		// sandbox definition
		this.bindNode('sandbox', '.my-widget');
		// a definition of container for HTML nodes
		this.bindNode('container', '.my-list');
	}
}
```
In the example above the HTML nodes will be inserted into ``.my-list`` instead of ``.my-widget``.

The ``itemRenderer`` property supports a few variants of defining, but they all must contain or return the only HTML node.

#### HTML string as a property value

```js
class MyArray extends Matreshka.Array {
	get Model() { return MyModel; }
	itemRenderer = '<div class="my-div">foo</div>';
	constructor() { ... }
}
```

#### A selector as a property value
In case if you carry over the templates for the items to the HTML page, ``itemRenderer`` supports the selector as a value. When this occurs, [`Matreshka.Array`](/api/matreshka-array/) will search for HTML node in DOM tree and it will extract ``innerHTML`` of found node. In case if a node is not found, an exception will be thrown.

> HTML string is different from a selector due to the presence of the ``<`` symbol in a string.

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

#### A function as a property value
The usage of a function as the ``itemRenderer`` property value gives an additional code flexibility if it is necessary to dynamically generate HTML node for rendering. A function can return:

__HTML string__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return '<div class="my-div">foo</div>';
	}
}
```

__A selector__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return '#my-template';
	}
}
```

__DOM node__
```js
class MyArray extends Matreshka.Array {
	itemRenderer() {
		return document.createElement('div');
	}
}
```

#### Parent renderer overlapping by the ``render`` property
Sometimes it is convenient to declare a renderer inside a [model](/api/matreshka-array/model/) class. The ``renderer`` property overlaps the ``itemRenderer`` value if it is specified for a child item of a collection.
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
In this case you do not have to designate ``itemRenderer`` at all because ``render`` of a child item adopts all its roles. The syntax remains the same:  HTML string, a selector or a function can be used.

#### ``render`` and ``afterrender`` events
After an item has been inserted into an array and its HTML node has already been created but it hasn't been inserted into array container yet, the ``render`` event is fired on inserted item. After its triggering you can declare needed data bindings.

``afterrender`` is fired when HTML node is inserted into the container.

```html
<form class="my-form"></form>
```
```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);

		// wait for the event triggering
		this.on('render', () => {
            // define bindings
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

The code above will create the following HTML tree:

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

And it will bind the checkboxes to the corresponding ``isChecked`` and ``text`` properties.

Remember, the opportunity of listening delegated events is implemented in the framework. The array can listen to an event of an item rendering, using the ``*@render`` event name (see the documentation of [`eventNames`](/api/types/event-names/)).
```js
this.on('*@render', () => {
	alert('Child item is rendered');
});
```

> Rendered HTML node becomes a sandbox for inserted item allowing to use the ``:sandbox`` selector and some other possibilities after rendering. If an item enters a few collections at once, set the ``bindRenderedAsSandbox`` property to ``false`` for an item to cancel this behavior.
```js
class MyModel extends Matreshka.Object {
	bindRenderedAsSandbox = false;
	// ...
}
```

#### ``onItemRender`` and ``onRender``

To improve the readability of code there is a virtual method called [`Matreshka.Array#onItemRender`](/api/matreshka-array/on-item-render/), which can be used instead of ``render`` event. As second alternative, the ``onRender`` can be used for a "model".

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

#### A template engine
If you have a look at the examples of using [`Matreshka.Array`](/api/matreshka-array/) and [`Matreshka.Array#itemRenderer`](/api/matreshka-array/item-renderer/), you can notice that all logic which is responsible for the two-way and one-way data binding is contained in JavaScript code. But when you develop a very simple collection which does not include complicated logic, lots of bindings, etc, you would like to have a shorter variant of the binding declaration. A template including bindings (see [`Matreshka#parseBindings`](/api/matreshka/parse-bindings/)) can be passed to ``itemRenderer`` for that.

```js
class MyArray extends Matreshka.Array {
	itemRenderer = `<label>
		<input type="checkbox" checked="{{isChecked}}">{{text}}
	</label>`;
	// ...
}

const app = new MyArray();
```

#### The cancellation of rendering
As is seen from above  if the ``render`` property of the child item is specified, ``Matreshka.Array`` will try to render it. In order to completely cancel rendering for an array, set a property  ``renderIfPossible`` of ``Matreshka.Array`` instance as ``false``.
```js
class MyArray extends Matreshka.Array {
	renderIfPossible = false;
	// ...
}
```

#### Moving an object across few collections
By default, when you add an object to an array the framework will try to render it using ``itemRenderer``. It gives a great advantage in cases when you have two or more lists which include the same object. The lists react instantly on any change in the object.

But sometimes you just need to move an object across few collections without re-rendering it again. If you need to move object to another collection including its sandbox use the ``moveSandbox`` flag while adding the new item to another array.

```js
this.push_(item, {
	moveSandbox: true
});
```

#### ``itemRenderer`` reassigning

When you reassign ``itemRenderer`` a collection rerenders automatically.

```js
this.itemRenderer = '<div class="new-renderer"></div>';
```

This ability allows to load renderer from a server.

```js
fetch('templates/template.html')
	.then(resp => resp.text())
	.then(data => {
		this.itemRenderer = data;
	});
```

To render the only objects which aren't yet rendered use [`Matreshka#set`](/api/matreshka/set/) with ``forceRerender`` flag set to ``false``.
```js
this.set('itemRenderer', renderer, {
	forceRerender: false
});
```
It's useful when you use server prerendering (look at the [`Matreshka.Array#restore`](/api/matreshka-array/restore/)) and template needs to be loaded asynchronously.
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

#### Rendering of a collection that contains any kind of object

It's not obligatory to fill an array with only ``Matreshka`` instances, you can render any kind of object. Bindings for such objects can be defined using static method [`Matreshka.bindNode`](/api/matreshka-static/bind-node/).

```js
class MyArray extends Matreshka.Array {
	// Model is not given
	itemRenderer = ...;
	onItemRender(item) {
		Matreshka.bindNode(item, 'x', ':sandbox .some-node');
	}
}
```

One more little example: the rendering of a simple list:
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

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `item` | [`object`](/api/types/object/) | An object, which will be rendered (in case you need to use some conditions) |

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)
- [`Matreshka.Array#Model`](/api/matreshka-array/model/)
