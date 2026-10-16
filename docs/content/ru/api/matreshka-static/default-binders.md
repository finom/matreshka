---
title: "Matreshka.defaultBinders"
sidebarTitle: "defaultBinders"
description: "Matreshka.defaultBinders: Массив функций, возвращающих соответствующий байндер или undefined"
importance: 2
---

# Matreshka.defaultBinders

**Свойство**

**Импорт:**

```js
import defaultBinders from 'matreshka/defaultbinders';
```

```js
Matreshka.defaultBinders: array
```

Массив функций, возвращающих соответствующий байндер или ``undefined``

``defaultBinders`` - массив функций, которые по очереди проверяют элемент на соответствие заданным в этих функциях правилам и возвращающих байндер (см. [`binder`](/ru/api/types/binder/)). Этот массив используется тогда, когда в метод [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/) не был передан третий аргумент. Подробную информацию о привязках смотрите в документации к [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/).

## Ссылки

- [`Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [`Matreshka.lookForBinder`](/ru/api/matreshka-static/look-for-binder/)

## Примеры

```js
Matreshka.defaultBinders.unshift(element => {
	// проверяем, есть ли у элемента класс "foo"
	if(element.classList.contains('foo')) {
		// если проверка пройдена, возвращаем новый байндер
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
