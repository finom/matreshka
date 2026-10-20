---
title: "FAQ"
description: "Як Matreshka.js працює всередині, як відрендерити додаток на сервері, що таке debounce, яким є великий додаток і як показати один об’єкт у двох колекціях."
---

# FAQ

## Як працює Matreshka.js?

Фреймворк використовує акцессори (accessors) для реалізації двостороннього зв'язування даних і вилову подій зміни властивостей.

Для того щоб зрозуміти, як працює двостороннє зв'язування (зокрема, функція [`Matreshka.bindNode`](/ua/api/matreshka-static/bind-node/)), погляньте на цей код:
```js
function bindNode(object, key, node, binder) {
    let value = object[key];
    Object.defineProperty(object, key, {
        get() {
            return value;
        },
        set(v) {
            binder.setValue.call(node, v);
        }
    });

    node.addEventListener(binder.on, () => {
        value = binder.getValue.call(node);
    });
}
```
Для спрощення, функція не підтримує зв'язок багато-до-багатьох і інші фічі оригіналу.

## Як попередньо відрендерити додаток на сервері?

Можна використовувати Matreshka.js на сервері Node.js (потрібна наявність [jsdom](https://github.com/jsdom/jsdom), точніше, об'єкта ``window``, доступного глобально) або скористатися абсолютно будь-яким шаблонізатором на будь-якій серверній платформі. Перший варіант підходить для статичної генерації HTML, другий - для сторінок, які генеруються при кожному зверненні користувача.

Завдання клієнтської сторони - відтворити додаток з HTML. [`Matreshka#bindNode`](/ua/api/matreshka/bind-node/) витягне стан елемента і привласнить його властивості, а [`Matreshka.Array#restore`](/ua/api/matreshka-array/restore/) відновить стан колекції.

## Що таке debounce?

У документації часто зустрічається фраза "мікропаттерн debounce". Це поширений патерн, який перетворює кілька викликів функції протягом певного часу в один виклик. Детальніше [тут](https://davidwalsh.name/javascript-debounce-function).

## Що з себе повинен представляти великий додаток?

Додаток на базі Matreshka.js, як правило, представляє з себе один вкладений JavaScript об'єкт, кожна гілка якого - екземпляр [`Matreshka`](/ua/api/matreshka/). Нові гілки додатку створюються за допомогою [`Matreshka#instantiate`](/ua/api/matreshka/instantiate/), що гарантує цілісність програми та можливість повернути попередній стан додатку або однієї його гілки звичайними привласненням.

## Як відрендерити один об'єкт в контейнерах декількох колекцій?

Перше: потрібно встановити класу цього об'єкту властивість ``bindRenderedAsSandbox`` зі значенням ``false``. Це відключає автоматичне створення пісочниці при рендеринзі об'єкта в масиві (так як заборонено одному об'єкту мати дві пісочниці).

Друге: за подією ``render`` перевірити, в якій масив був вставлений об'єкт і оголосити байндінги, відповідні до масиву. Батьківський масив і відмальований елемент можна отримати, звернувшись до властивостей ``parentArray`` і ``node`` об'єкта події.

Приклад. Є клас об'єкта ``User`` і дві колекції: ``UsersA`` і ``UsersB`` (їх [`Matreshka.Array#itemRenderer`](/ua/api/matreshka-array/item-renderer/) може відрізнятися). Для обох колекцій ``User`` використовується в якості [`Matreshka.Array#Model`](/ua/api/matreshka-array/model/).

```js
class User extends Matreshka.Object {
	constructor() {
		super();

		this.bindRenderedAsSandbox = false;

		setInterval(() => {
			// змінивши name зміняться і всі пов'язані
			// з цією властивістю елементи
			this.name = Math.random();
		}, 5000);
	}
	onRender(evt) {
		const { parentArray, node } = evt;

		if(parentArray instanceof UsersA) {
			this.bindNode({
				// створюємо псевдо-пісочницю
				// для синтаксичного цукру в селекторах
				// (це не обов'язково)
				nodeA: node,
				name: { node: ':bound(nodeA) .name', binder: Matreshka.binders.text() },
				email: { node: ':bound(nodeA) .email', binder: Matreshka.binders.text() },
			});
		} else if(parentArray instanceof UsersB) {
			this.bindNode({
				nodeB: node,
				name: { node: ':bound(nodeB) .user-name', binder: Matreshka.binders.text() },
			});
		}
	}
}
```

Насправді є багато способів вирішення цієї задачі. Наприклад, можна оголошувати байндінги на рівні масиву (тобто масив буде слухати подію ``render`` вставлених об'єктів) або на рівні масиву прив'язувати тільки псевдо-песоніцу, а на рівні об'єкта слухати подію ``bind`` і оголошувати інші прив'язки...
