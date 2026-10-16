---
title: "eventOptions"
sidebarTitle: "eventOptions"
description: "eventOptions: An event object. Matreshka.js API reference"
---

# eventOptions

**Type**

An event object

An object which can contain service flags or custom data which will be passed to an event handler

## Examples

```js
const eventOptions = { silent: true };

this.a = 1;

this.on('change:a', () => {
	alert('a is changed');
});

this.set('a', 2, eventOptions); // no alert
```

```js
const eventOptions = { f: 'yeah' };

this.a = 1;

this.on('change:a', eventOptions => {
	alert(eventOptions.f);
});

this.set('a', 2, eventOptions); // alerts "yeah"
```
