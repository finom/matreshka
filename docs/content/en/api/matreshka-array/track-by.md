---
title: "Matreshka.Array#trackBy"
sidebarTitle: "trackBy"
description: "Matreshka.Array#trackBy: trackBy property indicates a key of unique IDs for collection items"
importance: 2
---

# Matreshka.Array#trackBy

**Property** · Defined by you

```js
Matreshka.Array#trackBy: string
```

``trackBy`` property indicates a key of unique IDs for collection items

In case if a client and a server activelly communicate with each other and collection items have unique IDs, then redrawing entire collection from scratch does not make sense. After the server respond with new collection, much better to check does the old collection contain objects which have the corresponding identifiers. If object ID from new collection matches object ID from old one, old object will be updated and used again. That means a new object (new instance of [`Matreshka.Array#Model`](/api/matreshka-array/model/)) will not be created and new DOM node will not be rendered.

``trackBy`` works only using [`Matreshka.Array#recreate`](/api/matreshka-array/recreate/) because ``recreate`` is the only method which recreates collection from scratch.

In examples below ``_id`` key is used as identifier (you can use any other key).

```js
class MyArray extends Matreshka.Array {
	get trackBy() {
		return '_id';
	}
	constructor() {
		super();
		//...
	}
}

const arr = new MyArray();

// adds 3 objects to the collection
arr.recreate([
	{_id: 0, name: 'Foo'},
	{_id: 1, name: 'Bar'},
	{_id: 2, name: 'Baz'}
]);

// the next recreate call
// removes an object with _id: 0
// adds an object with _id: 3
// updates an object with _id: 1 (changes name from Bar to BarNew)
// updates an object with _id: 2 (changes name from Baz to BazNew)
// resorts collection
arr.recreate([
	{_id: 1, name: 'BarNew'},
	{_id: 3, name: 'Qux'},
	{_id: 2, name: 'BazNew'}
]);
```

``trackBy`` can have ``"$index"`` value, allowing to update objects by their index in collection.
```js
class MyArray extends Matreshka.Array {
	get trackBy() {
		return '$index';
	}
	constructor() {
		super();
		//...
	}
}

const arr = new MyArray();

// adds 3 objects to the collection
arr.recreate([
	{name: 'Foo'},
	{name: 'Bar'},
	{name: 'Baz'}
]);

// the next recreate call
// updates all 3 items with new "name"
// adds an object with name "Qux"
arr.recreate([
	{name: 'NewFoo'},
	{name: 'NewBar'},
	{name: 'NewBaz'},
	{name: 'Qux'}
]);
```

## Links

- [`Matreshka.Array#recreate`](/api/matreshka-array/recreate/)
