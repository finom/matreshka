---
title: "Matreshka.Array#restore"
sidebarTitle: "restore"
description: "Matreshka.Array#restore: Воссоздаёт Matreshka.Array из HTML узлов на странице."
importance: 2
---

# Matreshka.Array#restore

**Метод**

```js
Matreshka.Array#restore([selector], [eventOptions]) → matreshkaArray
```

Воссоздаёт [`Matreshka.Array`](/ru/api/matreshka-array/) из HTML узлов на странице.

В случае, если коллекция заранее отрисована на странице (например, с помощью сервера), метод может воссоздать коллекцию из отрендеренных HTML узлов.

```html
<!-- One, Two, Three заранее отрисованы -->
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
		this
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

Если аргумент ``selector`` не задан, то коллекция будет воссоздана из элементов, входящих в контейнер (``"container"`` или ``"sandbox"``).

При воссоздании, на каждом элементе массива генерируется событие ``render`` и вызываются методы ``onRender`` и ``onItemRender`` (см [документацию](/ru/api/matreshka-array/on-item-render/)), как и при [обычном рендеринге](/ru/api/matreshka-array/item-renderer/).

**Возвращает:** [`matreshkaArray`](/ru/api/types/matreshka-array/) – self

**Генерирует события:** `recreate`, `modify`, `add`, `addone`

## Аргументы

| Имя | Тип | Описание |
| --- | --- | --- |
| `selector` (необязательный) | `selector` | Селектор |
| `eventOptions` (необязательный) | [`eventOptions`](/ru/api/types/event-options/) | Объект события |
