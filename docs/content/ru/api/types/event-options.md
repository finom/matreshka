---
title: "eventOptions"
sidebarTitle: "eventOptions"
description: "eventOptions: Объект события. Matreshka.js справочник API"
---

# eventOptions

**Тип**

Объект события

Это обычный объект, который может содержать служебные флаги или произвольные данные, которые попадут в обработчик события

## Примеры

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
