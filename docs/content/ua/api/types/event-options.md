---
title: "eventOptions"
sidebarTitle: "eventOptions"
description: "eventOptions: Об'єкт події. Matreshka.js довідник API"
importance: 2
---

# eventOptions

**Тип**

Об'єкт події

Це звичайний об'єкт, котрий може містити службові прапори або довільні дані, які потраплять в обробник події

## Приклади

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
