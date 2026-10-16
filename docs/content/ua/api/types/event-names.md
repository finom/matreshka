---
title: "eventNames"
sidebarTitle: "eventNames"
description: "eventNames: Ім'я події або кілька імен, розділених пробілами."
importance: 2
---

# eventNames

**Тип**

Ім'я події або кілька імен, розділених пробілами.

##### Довільні події
```js
this.on('myevent', () => {...});
this.trigger('myevent');
```

##### ``change:KEY``, що викликається, коли властивість змінюється
```js
this.on('change:x', evt => {...});
this.x = 42;
```

##### ``beforechange:KEY``, що викликається, перед зміною властивості
```js
this.on('beforechange:x', evt => {...});
this.x = 42;
```

##### ``addevent:NAME`` і ``addevent``, що викликаються, коли подія ініціалізується
```js
// для всіх подій
this.on('addevent', evt => {...});
// для події "someevent"
this.on('addevent:someevent', evt => {...});
// генерує події "addevent" та "addevent:someevent"
this.on('someevent', evt => {...});
```

##### ``removeevent:NAME`` і ``removeevent``, що викликаються, коли обробник події видаляється
```js
// для всіх подій
this.on('removeevent', evt => {...});
// для події "someevent"
this.on('removeevent:someevent', evt => {...});
// генерує події "removeevent" та "removeevent:someevent"
this.off('someevent', evt => {...});
```

##### ``DOM_EVENT::KEY``, де DOM_EVENT - це им'я DOM події, KEY - ключ. Генерується тоді, коли подія DOM_EVENT спрацьовує на елементі, який пов'язаний з KEY.
```js
this.bindNode('x', '.my-div');
this.on('click::x', evt => {
	alert('clicked ".my-div"');
});
```

##### ``DOM_EVENT::KEY(SELECTOR)``, де DOM_EVENT - це им'я DOM події, KEY - ключ, SELECTOR - селектор. Генерується тоді, коли подія DOM_EVENT спрацьовує на елементі, який відповідає селектору SELECTOR, і знаходиться в елементі, який пов'язаний з властивістю KEY.

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

##### ``DOM_EVENT::(SELECTOR)``, де DOM_EVENT - це ім'я DOM події, SELECTOR - селектор. Генерується тоді, коли подія DOM_EVENT спрацьовує на елементі, який відповідає селектору SELECTOR, і знаходиться в пісочниці поточного об'єкта.
```js
this.bindNode('sandbox', '.my-div');
this.on('click::(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```
Те ж саме, що і:
```js
this.bindNode('sandbox', '.my-div');
this.on('click::sandbox(.my-button)', evt => {
	alert('clicked ".my-button"');
});
```

##### Делеговані події ``PATH@EVENT``, де PATH - це шлях до об'єкта, події якого ми бажаємо прослуховувати, EVENT - це ім'я події.
```js
this.on('a@someevent', () => {...});
this.on('a.b.c@change:d', () => {...});
```

При виникненні необхідності слухати зміни в усіх елементах [`Matreshka.Array`](/ua/api/matreshka-array/) або у всіх властивостях, що відповідають за дані [`Matreshka.Object`](/ua/api/matreshka-object/), замість імені властивості можна вказати зірочку "*".
```js
this.on('*@someevent', () => {...});
this.on('*.b.*.d@change:e', () => {...});
```

#### Різні комбінації
Всі наведені вище варіанти синтаксису можна комбінувати довільним способом.
```js
this.on('x.y.z@click::(.my-selector)', () => {...});
```
