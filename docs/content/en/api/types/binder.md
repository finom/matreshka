---
title: "binder"
sidebarTitle: "binder"
description: "binder: binder contains all information about how to synchronize instance property value with DOM node state. Every member of a binder uses HTML node as its…"
importance: 2
---

# binder

**Type**

``binder`` contains all information about how to synchronize instance property value with DOM node state. Every member of a binder uses HTML node as its context (``this``)

## Properties

| Name | Type | Details |
| --- | --- | --- |
| `on` (optional) | [`string`](/api/types/string/) \| [`function`](/api/types/function/) | DOM event (or space-delimited list of events) which tells when the node state is changed. Besides, it accepts a function as a value if you need to customize a listener definition |
| `getValue` (optional) | [`function`](/api/types/function/) | A function which tells how to retrieve a value (state) from HTML node when DOM event is fired |
| `setValue` (optional) | [`function`](/api/types/function/) | A function which tells how to change DOM node when the property value is changed |
| `initialize` (optional) | [`function`](/api/types/function/) | A function which is called before binding is launched. For example it can initialize jQuery plugin or something else |
| `destroy` (optional) | [`function`](/api/types/function/) | A function which is called when a binding is removed using ``unbindNode`` method |

## Examples

```js
const binder = {
	on: 'click',
	getValue(bindingOptions) {
		return this.value;
	},
	setValue(v, bindingOptions) {
		this.value = v;
	},
	initialize(bindingOptions) {
		alert('A binding is initialized');
	},
	destroy(bindingOptions) {
		alert('A binding is destroyed');
	}
};

this.bindNode('a', '.my-checkbox', binder);
```

```js
const binder = {
	on(callback, bindingOptions) {
		this.onclick = callback;
	},
	// ...
};
// ...
```
