---
title: "Matreshka.Array#restore"
sidebarTitle: "restore"
description: "Matreshka.Array#restore: Restores Matreshka.Array instance from existing HTML nodes on a page."
importance: 2
---

# Matreshka.Array#restore

**Method** · Since 1.3

```js
Matreshka.Array#restore([selector], [eventOptions]) → matreshkaArray
```

Restores [`Matreshka.Array`](/api/matreshka-array/) instance from existing HTML nodes on a page.

In case if a collection is pre-rendered on the page (e. g. via webserver), the method can restore the collection from existing HTML nodes.

```html
<!-- One, Two, Three are prerendered -->
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

If ``selector`` arg isn't passed then the collection will be restored from child nodes that placed in a container (``"container"`` or ``"sandbox"``).

The method fires  ``"render"`` event and calls ``onRender`` and ``onItemRender`` functions (look at the [docs](/api/matreshka-array/on-item-render/)) for every newly added item similar to [usual rendering](/api/matreshka-array/item-renderer/).

**Returns:** [`matreshkaArray`](/api/types/matreshka-array/) – self

**Fires:** `recreate`, `modify`, `add`, `addone`

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `selector` (optional) | `selector` | A selector |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | An event options |
