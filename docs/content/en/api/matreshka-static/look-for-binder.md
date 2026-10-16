---
title: "Matreshka.lookForBinder"
sidebarTitle: "lookForBinder"
description: "Matreshka.lookForBinder: Returns a binder corresponding to an element. If it is not found, it returns undefined. The function uses Matreshka.defaultBinders…"
importance: 3
---

# Matreshka.lookForBinder

**Method**

**Import:**

```js
import lookForBinder from 'matreshka/lookforbinder';
```

```js
Matreshka.lookForBinder(node) → binder
```

Returns a binder corresponding to an element. If it is not found, it returns ``undefined``. The function uses [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/) for the search.

**Returns:** [`binder`](/api/types/binder/) – binder

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `node` | [`node`](/api/types/node/) |  |

## Links

- [`Matreshka#bindNode`](/api/matreshka/bind-node/)
- [`Matreshka.defaultBinders`](/api/matreshka-static/default-binders/)

## Examples

```js
const element = document.createElement('input');
element.type = 'text';

console.log(Matreshka.lookForBinder(element));

// will return something similar to the following object
{
	on: 'input',
	getValue() {
		return this.value;
	},
	setValue(v) {
		this.value = v;
	}
}
```
