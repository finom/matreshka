---
title: "eventNames"
sidebarTitle: "eventNames"
description: "eventNames: Имя события или несколько имен, разделенных пробелами."
---

# eventNames

**Тип**

Имя события или несколько имен, разделенных пробелами.

> Здесь представлен краткий список событий с небольшими примерами. Для получения полной информации, прочтите [эту статью на Хабре](https://habr.com/ru/articles/267513/).

##### Произвольные события
```js
this.on('myevent', () => {...});
this.trigger('myevent');
```

##### ``change:KEY``, вызывающееся, когда свойство меняется
```js
this.on('change:x', evt => {...});
this.x = 42;
```

##### ``beforechange:KEY``, вызывающееся перед изменением свойства
```js
this.on('beforechange:x', evt => {...});
this.x = 42;
```

##### ``addevent:NAME`` и ``addevent``, вызывающееся при инициализации события
```js
// для всех событий
this.on('addevent', evt => {...});
// для события "someevent"
this.on('addevent:someevent', evt => {...});
// генерирует события "addevent" и "addevent:someevent"
this.on('someevent', evt => {...});
```

##### ``removeevent:NAME`` и ``removeevent``, вызывающееся при удалении обработчика события
```js
// для всех событий
this.on('removeevent', evt => {...});
// для события "someevent"
this.on('removeevent:someevent', evt => {...});
// генерирует события "removeevent" и "removeevent:someevent"
this.off('someevent', evt => {...});
```

##### ``DOM_EVENT::KEY``, где DOM_EVENT - имя DOM события, KEY - ключ. Генерируется тогда, когда событие DOM_EVENT срабатывает на элементе, который связан с KEY.
```js
this.bindNode('x', '.my-div');
this.on('click::x', evt => {
	alert('clicked ".my-div"');
});
```

##### ``DOM_EVENT::KEY(SELECTOR)``, где DOM_EVENT - имя DOM события, KEY - ключ, SELECTOR - селектор. Генерируется тогда, когда событие DOM_EVENT срабатывает на элементе, который соответствует селектору SELECTOR, и находится в элементе, который связан со свойством KEY.

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

##### ``DOM_EVENT::(SELECTOR)``, где DOM_EVENT - имя DOM события, SELECTOR - селектор. Генерируется тогда, когда событие DOM_EVENT срабатывает на элементе, который соответствует селектору SELECTOR, и находится в песочнице текущего объекта.

```js
this.bindNode('sandbox', '.my-div');
this.on('click::(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```
То же самое, что и:
```js
this.bindNode('sandbox', '.my-div');
this.on('click::sandbox(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```

##### Делегированные события ``PATH@EVENT``, где PATH - путь к объекту, события которого мы желаем прослушивать, EVENT - имя события.
```js
this.on('a@someevent', () => {...});
this.on('a.b.c@change:d', () => {...});
```

При возникновении необходимости слушать изменения во всех элементах [`Matreshka.Array`](/ru/api/matreshka-array/) или во всех свойствах, отвечающих за данные [`Matreshka.Object`](/ru/api/matreshka-object/), вместо имени свойства можно указать звездочку "*".
```js
this.on('*@someevent', () => {...});
this.on('*.b.*.d@change:e', () => {...});
```

#### Всевозможные комбинации
Все приведенные выше варианты синтаксиса можно комбинировать произвольным способом.
```js
this.on('x.y.z@click::(.my-selector)', () => {...});
```
