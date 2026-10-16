---
title: "Matreshka.Array#mediateItem"
sidebarTitle: "mediateItem"
description: "Matreshka.Array#mediateItem: Transforms an item value. Matreshka.js API reference"
importance: 2
---

# Matreshka.Array#mediateItem

**Method** · Since 0.1

```js
Matreshka.Array#mediateItem(mediator)
```

Transforms an item value

This method is used to transform ``Matreshka.Array`` items. Note that calling of this method overrides the [`Matreshka.Array#Model`](/api/matreshka-array/model/) property.

Calling the method converts the items the array already has and replaces their rendered nodes; no events are fired.

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `mediator` | [`function`](/api/types/function/) | A function which should return transformed value of an item |

## Links

- [`Matreshka.Array#Model`](/api/matreshka-array/model/)
- [`Matreshka#mediate`](/api/matreshka/mediate/)

## Examples

```js
// all the array items are integers
this.mediateItem(item => parseInt(item) || 0);
```

```js
this.push(1, 2, 3, 4, 5);

// all the array items are strings
this.mediateItem(String);

this.push(6, 7);

this.unshift(true, {});

// ["true", "[object Object]", "1", "2", "3", "4", "5", "6", "7"]
console.log(matreshkaArray.toJSON());
```

```js
this.mediateItem(item => {
	if(item.something) {
		return new FirstModel(item);
	} else {
		return new SecondModel(item);
	}
});
```
