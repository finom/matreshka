# The events

The article explains events in Matreshka.js framework. They can be called a heart of Matreshka.js because they power all the magic happened at ``calc``, ``bindNode``, ``instantiate`` and other methods.

## Basics
### Custom events

Let’s start with the simplest thing. In Matreshka.js events can be added with the help of [on](https://matreshka.js.org/api/matreshka/on/) method.

```js
const handler = () => {
  alert('"someeevent" is fired');
};
this.on('someevent', handler);
```

Where the list of events separated by spaces can be passed to.

```js
this.on('someevent1 someevent2', handler);
```

Static [Matreshka.on](https://matreshka.js.org/api/matreshka-static/on/) method is used to declare an event handler for a custom object (which is or is not ``Matreshka`` instance) (the difference is only that the target object is the first argument but not ``this``).

```js
const object = {};
Matreshka.on(object, 'someevent', handler);
```

Events can be fired with [trigger](https://matreshka.js.org/api/matreshka/trigger/) method.

```js
this.trigger('someevent');
```

Use the [static alternative of the method](https://matreshka.js.org/api/matreshka-static/trigger/) for custom objects.

```js
Matreshka.trigger(object, 'someevent');
```

At the same time, you can pass some data to the handler having determined the first and the following arguments.

```js
this.on('someevent', (a, b, c) => {
  alert([a, b, c]); // 1,2,3
});
this.trigger('someevent', 1, 2, 3);
```

Or

```js
Matreshka.on(object, 'someevent', (a, b, c) => {
  alert([a, b, c]); // 1, 2, 3
});
Matreshka.trigger(object, 'someevent', 1, 2, 3);
```

You can notice Backbone syntax here. That’s right: the first lines of Matreshka.js code were being written under the impression of Backbone (even the code has originally been borrowed from it, though it has undergone substantial transformation later).

Hereafter, in this post, I will show alternative methods which use ``this`` key-word (except the examples of delegated events). Just remember that [on](https://matreshka.js.org/api/matreshka-static/on/), [once](https://matreshka.js.org/api/matreshka-static/once/), [onDebounce](https://matreshka.js.org/api/matreshka-static/on-debounce/), [trigger](https://matreshka.js.org/api/matreshka-static/trigger/), [set](https://matreshka.js.org/api/matreshka-static/set/), [bindNode](https://matreshka.js.org/api/matreshka-static/bind-node/) and other methods of Matreshka.js have got static alternatives which accept a custom target object as the first argument.

Besides ``on`` method, there are two more: [once](https://matreshka.js.org/api/matreshka-static/once/) and [onDebounce](https://matreshka.js.org/api/matreshka-static/on-debounce/). The first one adds a handler that can be called only once.

```js
this.once('someevent', () => {
    alert('yep');
});
this.trigger('someevent'); // yep
this.trigger('someevent'); // nothing
```

The second one "debounces" the handler. When an event fires out, the timer with the specified delay by a programmer starts. If no event with the same name is called upon the expiry of the timer, a handler is called. If an event fires before the delay is over, the timer updates and waits again. This is the implementation of a very popular "debounce" micropattern which you can read about on [this page](http://davidwalsh.name/javascript-debounce-function).


```js
this.onDebounce('someevent', () => {
  alert('yep');
});
for(let i = 0; i < 1000; i++) {
  this.trigger('someevent');
}
// it will show ‘yep’ once in a very short space of time
```

Remember the method can accept a delay.

```js
this.onDebounce('someevent', handler, 1000);
```

### Events of property changing

When a property is changed, Matreshka.js fires an event: ``"change:KEY"``.

```js
this.on('change:x', () => {
    alert('x is changed');
});
this.x = 42;
```

In case you want to pass some data to the event handler or change a property value without calling ``"change:KEY"`` event, instead of a usual assignment use [Matreshka#set](https://matreshka.js.org/api/matreshka/set/) method (or static [Matreshka.set](https://matreshka.js.org/api/matreshka-static/set/) method) which accepts three arguments: a key, a value and an object with data or special flags.

```js
this.on('change:x', evt => {
    alert(evt.someData);
});
this.set('x', 42, { someData: 'foo' });
```

You can change a property without calling an event handler in this way:

```js
// changing doesn’t fire an event
this.set('x', 9000, { silent: true });
```

``set`` method supports some more flags, the description of which would make us go beyond the topic of the article, so I refer you to the [documentation of the method](https://matreshka.js.org/api/matreshka/set/).

### Events which are being fired before a property changing

``"beforechange:KEY"`` is being fired before a property changing. The event can be useful in cases you define ``"change:KEY"`` event and want to call the code which precedes this event.

```js
this.on('beforechange:x', () => {
    alert('x will be changed in few microseconds');
});
```

You can pass some data to the handler or cancel an event triggering.

```js
this.on('beforechange:x', evt => {
    alert(evt.someData);
});

this.set('x', 42, { someData: 'foo' });

// changing doesn’t fire an event
this.set('x', 9000, { silent: true });
```

### Events of a property removing

On removing properties with [remove](https://matreshka.js.org/api/matreshka/remove/) method, ``"delete:KEY"`` and ``delete`` events are fired.

```js
this.on('delete:x', () => {
    alert('x is deleted');
});

this.on('delete', evt => {
  alert(`${evt.key} is deleted`);
});

this.remove('x');
```

### Binding events
On the binding declaration two events: ``"bind"`` and ``"bind:KEY"`` are fired, where ``KEY`` is a key of a bound property.

```js
this.on('bind:x', () => {
    alert('x is bound');
});

this.on('bind', evt => {
    alert(`${evt.key} is bound`);
});

this.bindNode('x', '.my-node');
```

This event can be of use, for example, when another class controls bindings and you need to execute your code after some binding (for instance, sandbox binding).


## The events of event adding/removing

![](https://cdn-images-1.medium.com/max/800/0*6033LMExhDnrCE61.)

When an event is added, ``"addevent"`` and ``"addevent:NAME"`` events are fired, and when an event is removed, ``"removeevent"`` and ``"removeevent:NAME"`` events are fired, where ``NAME`` is an event name.

```js
this.on('addevent', handler);
this.on('addevent:someevent', handler);
this.on('removeevent', handler);
this.on('removeevent:someevent', handler);
```

One of the ways of its application can be the use of Matreshka.js and the event engine of the third-party library together. Let’s say, you want to place all handlers for the class only in one [on](https://matreshka.js.org/api/matreshka/on/#variation-2) call, having made the code more readable and compact. With the help of ``addevent`` you catch all the following event initializations, and in the handler you check an event name against some conditions and initialize an event using API of the third-party library. In the example below there’s a code from a project which uses Fabric.js. ``"addevent"`` handler checks an event name for the presence of ``"fabric:"`` prefix and if checking is passed, it adds the corresponding handler to the canvas with the help of Fabric API.

```js
this.canvas = new fabric.Canvas(node);
this.on({
    'addevent': evt => {
        const { name, callback } = evt;
        const prefix = 'fabric:';
        if(name.indexOf(prefix) == 0) {
            const fabricEventName = name.slice(prefix.length);
            // add an event to the canvas
            this.canvas.on(fabricEventName, callback);
        }
    },
    'fabric:after:render': evt => {
        this.data = this.canvas.toObject();
    },
    'fabric:object:selected': evt => { /* ... */ }
});
```

## Delegated events

Now let’s get down to the most interesting: event delegations. The syntax of delegated events is as follows: ``"PATH@EVENT_NAME"``, where ``PATH ``is a path (properties are separated by a dot) to an object which ``EVENT_NAME`` event needs to be added to. Let’s consider examples below.

### Example 1
You want to add an event handler in ``"a"`` property which is an object.
```js
this.on('a@someevent', handler);
```

The handler will be called when ``"someevent"`` event has fired in the ``"a"`` object.

```js
// if a is an instance of Matreshka
this.a.trigger('someevent');
// if a is an ordinary object or an instance of Matreshka
Matreshka.trigger(this.a, 'someevent');
```

Also, the handler can be declared before ``"a"`` property is declared. If ``"a"`` property is rewritten into another object, inner mechanism of the framework will catch this change, remove the handler from the previous property value and add it to a new value (if the new value is an object as well).

```js
this.a = new Matreshka();
this.a.trigger('someevent');
//or
this.a = {};
Matreshka.trigger(this.a, 'someevent');
```

The handler will be called again.

### Example 2

What if our object is a collection inherited from [Matreshka.Array](https://matreshka.js.org/api/matreshka-array/) or [Matreshka.Object](https://matreshka.js.org/api/matreshka-object/) (``Matreshka.Object`` is a collection of a key-value type)? We don’t know beforehand in which item of the collection an event will be fired (in the first or in the tenth one). That’s why, instead of a property name for these classes we can use an asterisk ``*`` meaning that an event handler must be called only when an event is fired upon one of the elements included into the collection.

```js
this.on('*@someevent', handler);
```
If the included element is an instance of ``Matreshka``:

```js
this.push(new Matreshka());
this[0].trigger('someevent');
```

Or, in case the included element is an ordinary object or an instance of ``Matreshka``:

```js
this.push({});
Matreshka.trigger(this[0], 'someevent');
```

### Example 3
Let’s go deeper. Suppose we have ``"a"`` property that contains an object with ``"b"`` property, in which ``"someevent"`` event must be fired. In this case properties are separated by a dot:

```js
this.on('a.b@someevent', handler);
this.a.b.trigger('someevent');
//or
Matreshka.trigger(this.a.b, 'someevent');
```

### Example 4
We have ``"a"`` property which is a collection. We want to listen to ``"someevent"`` event that must be fired in some element included in this collection. Combine examples (2) and (3).

```js
this.on('a.*@someevent', handler);
this.a[0].trigger('someevent');
//or
Matreshka.trigger(this.a[0], 'someevent');
```

### Example 5
We have a collection containing objects with ``"a"`` property which is an object. We want to add a handler to all objects we have with ``"a"`` key in each element of the collection:

```js
this.on('*.a@someevent', handler);
this[0].a.trigger('someevent');
//or
Matreshka.trigger(this[0].a, 'someevent');
```

### Example 6

![](https://cdn-images-1.medium.com/max/800/0*14YRlzm6qlo9sfkv.)

We have a collection which items have ``"a"`` property that is a collection. In its turn, the ``"a"`` includes items containing ``"b"`` property which is an object. We want to catch ``"someevent"`` in all ``"b"`` objects:

```js
this.on('*.a.*.b@someevent', handler);
this[0].a[0].b.trigger('someevent');
//or
Matreshka.trigger(this[0].a[0].b, 'someevent');
```

### Example 7. Various combinations

Besides custom events, you can use the ones which are built in Matreshka.js as well. Instead of ``"someevent"`` you can use ``"change:KEY"`` event described above or ``"modify"`` which allows to listen to any changes in ``Matreshka.Object`` or ``Matreshka.Array``.

```js
// in “a” object there’s “b” object,
// in which we listen to changes of “c” property.
this.on('a.b@change:c', handler);
// “a” object is a collection of collections
// we want to catch changes
//(adding/removing/resorting of elements) of the last-named.
this.on('a.*@modify', handler);
```

Let me remind you that delegated events are added dynamically. On declaring a handler any branch of the way may be absent. If anything is overridden in the object tree, the binding to the old value is disrupted and a new one is created with a new value:

```js
this.on('a.b.c.d@someevent', handler);
this.a.b = { c: { d: {} } };
Matreshka.trigger(this.a.b.c.d, 'someevent');
```

## DOM events

Matreshka.js is known to allow the binding of DOM element on the page to some Matreshka.js instance property or an ordinary object implementing one-way or two-way data binding:

```js
this.bindNode('x', '.my-node');
//or
Matreshka.bindNode(object, 'x', '.my-node');
```

[More detailed information about bindNode method](https://matreshka.js.org/api/matreshka/bind-node/).

Before or after the declaration of the binding you can create a handler that listens to DOM events of the bound element. The syntax is as follows: ``"DOM_EVENT::KEY"``, where ``DOM_EVENT`` is DOM or jQuery event (if jQuery is used), and ``KEY`` is a key of a bound property. ``DOM_EVENT`` and ``KEY`` are separated by a double colon.

```js
this.on('click::x', evt => {
  evt.preventDefault();
});
```

The object of original DOM event is under ``"domEvent"`` key of the event object passed to the handler. Besides, there are several properties and methods available in the object so as not to address ``"domEvent"`` every time: ``"preventDefault"``, ``"stopPropagation"``, ``"which"``, ``"target"`` and some other properties.

This opportunity is syntactic sugar over ordinary DOM and jQuery events and the code below does the same things as the previous one:

```js
document.querySelector('.my-node').addEventListener('click', evt => {
    evt.preventDefault();
});
```

### Delegated DOM events

Event declaring from the example above requires binding declaring. You must take two steps: call ``bindNode`` method and declare the event as such. It isn’t always convenient because there are often some cases when DOM node isn’t used anywhere except the only DOM event. For this case there is another syntax variant of DOM events which looks like ``"DOM_EVENT::KEY(SELECTOR)"``. In this case ``KEY`` is some key bound to some DOM node. And ``SELECTOR`` is a selector of DOM node that is included into the one bound to ``KEY``.

HTML:
```html
<div class="my-node">
    <span class="my-inner-node"></span>
</div>
```
JS:
```js
this.bindNode('x', '.my-node');
this.on('click::x(.my-inner-node)', handler);
```

### Delegated DOM events inside a sandbox

If we need to create a handler for some element included into a sandbox, a little simplified ``"DOM_EVENT::(SELECTOR)"`` syntax is used.

Let me remind you that a sandbox limits the influence of ``Matreshka`` instance or a custom object to one element in your web application. For example, if there are several widgets on the page and each widget is driven by its class, it’s highly recommended to set a sandbox for each class referring to the root element of the widget which this class has influence on.

```js
this.bindNode('sandbox', '.my-node');
this.on('click::(.my-inner-node)', handler);
```

This code does absolutely the same thing:

```js
this.on('click::sandbox(.my-inner-node)', handler);
```

## Events of Matreshka.Object class

Remember ``Matreshka.Object`` is a class that is responsible for data of a key-value type. You can read more about this class [in documentation](https://matreshka.js.org//#!Matreshka.Object).

On every changing of properties which are responsible for data, ``"set"`` event is fired.

```js
this.on('set', handler);
```

On every removal of properties which are responsible for data, ``"remove"`` event is fired.

```js
this.on('remove', handler);
```

And on any modifying changes (property changes and deletions) ``"modify"`` event is fired.

```js
this.on('modify', handler);
```

In this easy way you can listen to all data changing instead of a manual property listening.

## Events of Matreshka.Array class

[Matreshka.Array](https://matreshka.js.org/api/matreshka-array/) includes lots of useful events which give an opportunity to find out what has happened in the collection: an item insertion, an item removing, resorting, which method has been called...

Let me remind you that ``Matreshka.Array`` is a class which is responsible for the implementation of collections in Matreshka.js framework. The class completely duplicates the methods of built-in [Array.prototype](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/prototype), and a programmer doesn’t have to think which method to call in order to add or remove something. The information you should know about ``Matreshka.Array`` events:

- On calling modifying methods which have been borrowed from ``Array.prototype``, the corresponding event (``"push"``, ``"splice"``, ``"pop"``...) is fired.
- On inserting items into the array, ``"add"`` and ``"addone"`` events are fired. Using the first one, an array of inserted items gets to ``"added"`` property of an event object. Using the second one, one inserted item gets to ``"addedItem"`` property, and the event is fired so many times according to how many items have been added.
- On removing items the same logic is used: ``"remove"`` is fired passing an array of removed items to ``"removed"`` property of an event object, and ``"removeone"`` is fired on each removed item, passing one removed element to property ``"removedItem"``.
- On any modifications of collection, ``"modify"`` event is fired. I. е. to catch ``"remove"`` and ``"add"`` events separately isn’t obligatory.

Some examples from the documentation:

```js
this.on('add', function(evt) {
    console.log(evt.added); // [1,2,3]
});
// the handler will launch thrice,
// as three new elements have been added to the array
this.on('addone', function(evt) {
  console.log(evt.addedItem); // 1 … 2 … 3
});
this.push(1, 2, 3);
```

In order not to copy the whole documentation here, please refer to [Matreshka.Array documentation](https://matreshka.js.org/api/matreshka-array/) on your own.
