---
title: "FAQ"
description: "Як Matreshka.js влаштована всередині, чому елементи оновлюються із затримкою, як тестувати, як рендерити на сервері та як побудувати великий застосунок."
---

# FAQ

## Як працює Matreshka?

Вона перетворює прив’язану властивість на аксесор. Сеттер записує значення в прив’язані елементи, а обробник DOM-події записує значення елемента назад у властивість. Спрощений [`bindNode`](/ua/api/matreshka/bind-node/) виглядає так:

```js
function bindNode(object, key, node, binder) {
    let value = object[key];
    Object.defineProperty(object, key, {
        get() {
            return value;
        },
        set(v) {
            value = v;
            binder.setValue.call(node, v);
        }
    });

    node.addEventListener(binder.on, () => {
        value = binder.getValue.call(node);
    });
}
```

Справжня функція до того ж підтримує кілька елементів на одну властивість, кілька властивостей на один елемент, події та все, про що йдеться нижче.

## Чому прив’язаний елемент оновлюється з невеликою затримкою?

До прив’язок застосовується debounce. Якщо властивість змінюється кілька разів поспіль, її елементи оновляться один раз — після завершення поточного завдання; те саме стосується значень, які читаються з елемента. Так серія змін не чіпає DOM багато разів.

Якщо коду потрібно побачити DOM одразу (наприклад, у тесті), зачекайте один тік (`await new Promise((r) => setTimeout(r))`) або вимкніть debounce для цієї прив’язки:

```js
bindNode(object, 'x', '.x', null, { debounceSetValue: false, debounceGetValue: false });
```

Прапори й затримки описано на сторінці [`bindNode`](/ua/api/matreshka/bind-node/). Сам патерн докладно розібрано [у цій статті](https://davidwalsh.name/javascript-debounce-function) (англійською).

## Як відрендерити застосунок на сервері?

Підійде будь-який серверний шаблонізатор: відмалюйте HTML як зазвичай. На клієнті [`bindNode`](/ua/api/matreshka/bind-node/) бере значення елемента у властивість, яка ще не має значення, а [`Matreshka.Array#restore`](/ua/api/matreshka-array/restore/) відновлює колекцію за вже відмальованими елементами. Можна також запустити саму Matreshka в Node.js з [jsdom](https://github.com/jsdom/jsdom) і генерувати статичний HTML.

## Як побудувати великий застосунок?

Як один вкладений об’єкт, кожна гілка якого — екземпляр [`Matreshka`](/ua/api/matreshka/). Нові гілки створюються через [`Matreshka#instantiate`](/ua/api/matreshka/instantiate/): він стежить, щоб кожна гілка залишалася екземпляром свого класу, і дає змогу замінити частину стану звичайним присвоєнням.

## Як відмалювати один об’єкт у двох колекціях?

По-перше, задайте `bindRenderedAsSandbox` рівним `false` у класі елемента. Це вимикає автоматичну пісочницю відмальованого об’єкта: один об’єкт не може мати двох пісочниць.

По-друге, під час відмалювання перевірте, яка колекція відмалювала об’єкт. Подія `render` (і метод `onRender`) отримує колекцію у властивості `parentArray`.

Приклад: клас `User` і дві колекції, `UsersA` та `UsersB`, у яких [`itemRenderer`](/ua/api/matreshka-array/item-renderer/) може відрізнятися. Обидві використовують `User` як [`Model`](/ua/api/matreshka-array/model/).

```js
class User extends Matreshka.Object {
    constructor() {
        super();

        this.bindRenderedAsSandbox = false;

        setInterval(() => {
            // коли змінюється "name", змінюються елементи в обох колекціях
            this.name = Math.random();
        }, 5000);
    }
    onRender(evt) {
        const { parentArray, node } = evt;

        if (parentArray instanceof UsersA) {
            this.bindNode({
                // ключ для відмальованого вузла, щоб селектори нижче починалися з нього
                nodeA: node,
                name: ':bound(nodeA) .name',
                email: ':bound(nodeA) .email',
            });
        } else if (parentArray instanceof UsersB) {
            this.bindNode({
                nodeB: node,
                name: ':bound(nodeB) .user-name',
            });
        }
    }
}
```

Прив’язки можна оголосити й у класах колекцій: колекція слухає подію `render` об’єктів, які до неї вставляються.
