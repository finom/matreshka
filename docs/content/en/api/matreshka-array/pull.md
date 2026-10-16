---
title: "Matreshka.Array#pull"
sidebarTitle: "pull"
description: "Matreshka.Array#pull: Removes an item with specified index from an array or an item itself"
importance: 2
---

# Matreshka.Array#pull

**Method** · Since 0.1

```js
Matreshka.Array#pull(indexOrValue, [eventOptions]) → *|null
```

Removes an item with specified index from an array or an item itself

**Returns:** [`*`](/api/types/any/) \| [`null`](/api/types/null/) – A deletee or ``null``

**Fires:** `pull`, `remove`, `removeone`, `modify`

## Arguments

| Name | Type | Details |
| --- | --- | --- |
| `indexOrValue` | [`object`](/api/types/object/) \| [`number`](/api/types/number/) | An item index (a number) which has to be removed or the deletee itself (an object) |
| `eventOptions` (optional) | [`eventOptions`](/api/types/event-options/) | An event object in case if it is needed to pass some data to event handlers or to set some service flags (eg. ``silent``) |

## Examples

**Passing of an index**

```js
let removed;

this.recreate(['a', 'b', 'c']);

removed = this.pull(1);

console.log(removed); // 'b'

console.log(this.join(',')); // 'a,c'
```

**Passing of a deletee object**

```js
const object1 = {};
const object2 = {};
const object3 = {};
let removed;

this.push(object1, object2, object3);

removed = this.pull(object2);

console.log(removed === object2); // true

console.log(this.length); // 2
```
