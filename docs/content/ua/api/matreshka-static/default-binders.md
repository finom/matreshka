---
title: "Matreshka.defaultBinders"
sidebarTitle: "defaultBinders"
description: "Matreshka.defaultBinders: Масив функцій, які повертають відповідний Байндер або undefined"
importance: 2
---

# Matreshka.defaultBinders

**Властивість**

**Імпорт:**

```js
import defaultBinders from 'matreshka/defaultbinders';
```

```js
Matreshka.defaultBinders: array
```

Масив функцій, які повертають відповідний Байндер або ``undefined``

``defaultBinders`` - масив функцій, які по черзі перевіряють елемент на відповідність заданим в цих функціях правилам і повертають байндер (див. [`binder`](/ua/api/types/binder/)). Цей масив використовується тоді, коли в метод [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) не був переданий третій аргумент. Детальну інформацію про байндінги дивіться в документації до [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/).

## Посилання

- [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [`Matreshka.lookForBinder`](/ua/api/matreshka-static/look-for-binder/)

## Приклади

```js
Matreshka.defaultBinders.unshift(element => {
	// перевіряємо, чи є у елемента клас "foo"
	if(element.classList.contains('foo')) {
		// якщо перевірка пройдена, повертаємо новий байндер
		return {
			on: ...,
			getValue: ...,
			setValue: ...
		};
	}
});

// ...

this.bindNode('myKey', '.foo.bar');
```
