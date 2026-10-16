---
title: "eventNames"
sidebarTitle: "eventNames"
description: "eventNames: Event name or space-delimited list of event names."
importance: 2
---

# eventNames

**Type**

Event name or space-delimited list of event names.

##### Custom events.
```js
this.on('myevent', () => {...});
this.trigger('myevent');
```

##### ``change:KEY`` which is triggered every time when a property is changed.
```js
this.on('change:x', evt => {...});
this.x = 42;
```

##### ``beforechange:KEY`` which is triggered every time before a property is changed.
```js
this.on('beforechange:x', evt => {...});
this.x = 42;
```

##### ``addevent:NAME`` and ``addevent`` which are triggered on event add.
```js
// for any event
this.on('addevent', evt => {...});
// for "someevent" event
this.on('addevent:someevent', evt => {...});
// the line below fires "addevent" and "addevent:someevent"
this.on('someevent', evt => {...});
```

##### ``removeevent:NAME`` and ``removeevent`` which are triggered on event remove.
```js
// for any event
this.on('removeevent', evt => {...});
// for "someevent" event
this.on('removeevent:someevent', evt => {...});
// the line below fires "removeevent" and "removeevent:someevent"
this.off('someevent', evt => {...});
```

##### ``DOM_EVENT::KEY``, where DOM_EVENT is a name of DOM event, KEY is a key. A handler is called when DOM_EVENT is triggered on a node which is bound to the KEY.
```js
this.bindNode('x', '.my-div');
this.on('click::x', evt => {
	alert('clicked ".my-div"');
});
```

##### ``DOM_EVENT::KEY(SELECTOR)``, where DOM_EVENT is a name of DOM event, KEY is a key, SELECTOR is a selector. A handler is called when DOM_EVENT is triggered on a node which matches the SELECTOR within a node bound to the KEY.
```html
<div class="my-div">
	<button class="my-button"></button>
</div>
```
```js
this.bindNode('x', '.my-div');
this.on('click::x(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```

##### ``DOM_EVENT::(SELECTOR)``, where DOM_EVENT is a name of DOM event, SELECTOR is a selector. A handler is called when DOM_EVENT is triggered on a node which matches the SELECTOR within a sandbox.

```js
this.bindNode('sandbox', '.my-div');
this.on('click::(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```
The same as:
```js
this.bindNode('sandbox', '.my-div');
this.on('click::sandbox(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```

##### Delegated events: ``PATH@EVENT``, where PATH is a path to a target object whose events we want to listen, EVENT is an event name.
```js
this.on('a@someevent', () => {...});
this.on('a.b.c@change:d', () => {...});
```

If you need to listen an event of every item of [`Matreshka.Array`](/api/matreshka-array/) or every data property of [`Matreshka.Object`](/api/matreshka-object/), you can use an asterisk "*" instead of specific property name.

```js
this.on('*@someevent', () => {...});
this.on('*.b.*.d@change:e', () => {...});
```

##### Any combinations. All events described above can be combined.
```js
this.on('x.y.z@click::(.my-selector)', () => {...});
```
