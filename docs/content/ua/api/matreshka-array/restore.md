---
title: "Matreshka.Array#restore"
sidebarTitle: "restore"
description: "Matreshka.Array#restore: Відтворює Matreshka.Array з HTML вузлів на сторінці."
importance: 2
---

# Matreshka.Array#restore

**Метод**

```js
Matreshka.Array#restore([selector], [eventOptions]) → matreshkaArray
```

Відтворює [`Matreshka.Array`](/ua/api/matreshka-array/) з HTML вузлів на сторінці.

У разі, якщо колекція заздалегідь відмальована на сторінці (наприклад, за допомогою сервера), метод може відтворити колекцію з HTML вузлів.

```html
<!-- One, Two, Three заздалегідь відмальовані -->
<ul class="collection-node">
	<li>One</li>
	<li>Two</li>
	<li>Three</li>
	<script type="text/html" class="renderer">
		<li></li>
	</script>
</ul>
```

```js
class MyModel extends Matreshka.Object {
	constructor(data) {
		super(data);
		this.addDataKeys('value');
	}
	onRender() {
		this.bindNode('value', ':sandbox', Matreshka.binders.html())
	}
}

class MyCollection extends Matreshka.Array {
	get itemRenderer() {
		return ':sandbox .renderer';
	}
	constructor() {
		super()
			.bindNode('sandbox', '.collection-node')
			.restore(':sandbox li');
	}
}

const myCollection = new MyCollection();
myCollection.push({
	value: 'Four'
});

console.log(myCollection.toJSON());
// [{value: 'One'}, {value: 'Two'}, {value: 'Three'}, {value: 'Four'}]
```

Якщо аргумент ``selector`` не заданий, то колекція буде відтворена з елементів, що входять в контейнер (``"container"`` або ``"sandbox"``).

При відтворенні, на кожному елементі масиву генерується подія ``render`` і викликаються методи ``onRender`` і ``onItemRender`` (див [документацію](/ua/api/matreshka-array/on-item-render/)), як і при [звичайному рендерингу](/ua/api/matreshka-array/item-renderer/).

**Повертає:** [`matreshkaArray`](/ua/api/types/matreshka-array/) – self

**Генерує події:** `recreate`, `modify`, `add`, `addone`

## Аргументи

| Ім'я | Тип | Опис |
| --- | --- | --- |
| `selector` (необов'язковий) | `selector` | Селектор |
| `eventOptions` (необов'язковий) | [`eventOptions`](/ua/api/types/event-options/) | Об'єкт події |
