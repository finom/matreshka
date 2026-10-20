---
title: "Matreshka.Array#onItemRender"
sidebarTitle: "onItemRender"
description: "Matreshka.Array#onItemRender: Функція, яка запускається перед подією render."
importance: 2
---

# Matreshka.Array#onItemRender

**Метод** · Визначається вами

```js
Matreshka.Array#onItemRender(item, renderEvent)
```

Функція, яка запускається перед подією ``render``.

Віртуальний метод ``onItemRender`` можна використовувати в якості заміни події ``render``.

При цьому, у вставленого айтема викликається віртуальний метод ``onRender`` з єдиним аргументом - об'єктом події.

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `item` | [`object`](/ua/api/types/object/) | Відмальований об'єкт колекції |
| `renderEvent` | [`object`](/ua/api/types/object/) | Об'єкт події ``render`` |

## Приклади

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
		return `<label>
			<input type="checkbox" class="my-checkbox">
			<span class="text"></span>
		</label>`;
	}
	constructor() {
		super().bindNode('sandbox', '.my-form');
	}
	onItemRender(item, renderEvt) {
		// ...
	}
}

const app = new MyArray();
```
