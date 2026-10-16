---
title: "binder"
sidebarTitle: "binder"
description: "binder: binder (байндер, привязчик) содержит всю информацию о том, как синхронизировать значение свойства с привязанным к нему DOM элементом. Для всех методов…"
---

# binder

**Тип**

``binder`` (байндер, привязчик) содержит всю информацию о том, как синхронизировать значение свойства с привязанным к нему DOM элементом. Для всех методов байндера контекст (``this``) - соответствующий DOM узел.

## Свойства

| Имя | Тип | Описание |
| --- | --- | --- |
| `on` (необязательный) | [`string`](/ru/api/types/string/) \| [`function`](/ru/api/types/function/) | Имя DOM события (или список имен событий, разделенных пробелами), после срабатывания которого извлекается состояние DOM элемента и устанавливается свойство. Кроме этого, значением свойства может быть функция, которая устанавливает обработчик произвольным образом. |
| `getValue` (необязательный) | [`function`](/ru/api/types/function/) | Функция, которая отвечает за то, как извлечь состояние DOM элемента |
| `setValue` (необязательный) | [`function`](/ru/api/types/function/) | Функция, которая отвечает за то, как установить значение свойства DOM элементу |
| `initialize` (необязательный) | [`function`](/ru/api/types/function/) | Функция, которая запускается при инициализации привязки. Например, может быть использована для инициализации jQuery плагина. |
| `destroy` (необязательный) | [`function`](/ru/api/types/function/) | Функция, которая вызывается после вызова метода ``unbindNode``. Если байндер достаточно сложен, ``destroy`` может содержать удаление логики, навешаной байндером |

## Примеры

```js
const binder = {
	on: 'click',
	getValue(bindingOptions) {
		return this.value;
	},
	setValue(v, bindingOptions) {
		this.value = v;
	},
	initialize(bindingOptions) {
		alert('A binding is initialized');
	},
	destroy(bindingOptions) {
		alert('A binding is destroyed');
	}
};

this.bindNode('a', '.my-checkbox', binder);
```

```js
const binder = {
	on(callback, bindingOptions) {
		this.onclick = callback;
	}
	// ...
};
// ...
```
