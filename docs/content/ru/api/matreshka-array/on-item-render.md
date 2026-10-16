---
title: "Matreshka.Array#onItemRender"
sidebarTitle: "onItemRender"
description: "Matreshka.Array#onItemRender: Функция, которая запускается перед событием render."
importance: 2
---

# Matreshka.Array#onItemRender

**Метод** · Определяется вами

```js
Matreshka.Array#onItemRender(item, renderEvent)
```

Функция, которая запускается перед событием ``render``.

Виртуальный метод ``onItemRender`` можно использовать в качестве замены события ``render``.

При этом, у отрисованного элемента вызывается виртуальный метод ``onRender`` с единственным аргументом - объектом события.

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `item` | [`object`](/ru/api/types/object/) | Отрисованный элемент коллекции |
| `renderEvent` | [`object`](/ru/api/types/object/) | Объект события ``render`` |

## Примеры

```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);
	}
	onRender(renderEvt) {
		this.bindNode('isChecked', ':sandbox .my-checkbox');
		this.bindNode('text', ':sandbox .text', Matreshka.binders.html());
	}
}

class MyArray extends Matreshka.Array {
	get Model() {
		return MyModel;
	}
	itemRenderer() {
		return '<li>'
	}
	constructor() {
		this.bindNode('sandbox', '.my-form');
	}
	onItemRender(item, renderEvt) {
		// ...
	}
}

const app = new MyArray();
```
