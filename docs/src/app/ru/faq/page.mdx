---
title: "FAQ"
description: "Как Matreshka.js устроена внутри, почему элементы обновляются с задержкой, как тестировать, как рендерить на сервере и как устроить крупное приложение."
---

# FAQ

## Как работает Matreshka?

Она превращает привязанное свойство в аксессор. Сеттер записывает значение в привязанные элементы, а обработчик DOM-события записывает значение элемента обратно в свойство. Упрощённый [`bindNode`](/ru/api/matreshka/bind-node/) выглядит так:

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

Настоящая функция вдобавок поддерживает несколько элементов на одно свойство, несколько свойств на один элемент, события и всё, о чём речь ниже.

## Почему привязанный элемент обновляется с небольшой задержкой?

К привязкам применяется debounce. Если свойство меняется несколько раз подряд, его элементы обновятся один раз — после того как закончится текущая задача; то же касается значений, которые читаются из элемента. Так серия изменений не трогает DOM много раз.

Если коду нужно увидеть DOM сразу (например, в тесте), подождите один тик (`await new Promise((r) => setTimeout(r))`) или отключите debounce для этой привязки:

```js
bindNode(object, 'x', '.x', null, { debounceSetValue: false, debounceGetValue: false });
```

Флаги и задержки описаны на странице [`bindNode`](/ru/api/matreshka/bind-node/). Сам паттерн подробно разобран [в этой статье](https://davidwalsh.name/javascript-debounce-function) (на английском).

## Как отрендерить приложение на сервере?

Подойдёт любой серверный шаблонизатор: отрисуйте HTML как обычно. На клиенте [`bindNode`](/ru/api/matreshka/bind-node/) берёт значение элемента в свойство, у которого ещё нет значения, а [`Matreshka.Array#restore`](/ru/api/matreshka-array/restore/) восстанавливает коллекцию по уже отрисованным элементам. Можно также запустить саму Matreshka в Node.js с [jsdom](https://github.com/jsdom/jsdom) и генерировать статический HTML.

## Как устроить крупное приложение?

Как один вложенный объект, каждая ветка которого — экземпляр [`Matreshka`](/ru/api/matreshka/). Новые ветки создаются через [`Matreshka#instantiate`](/ru/api/matreshka/instantiate/): он следит, чтобы каждая ветка оставалась экземпляром своего класса, и позволяет заменить часть состояния обычным присваиванием.

## Как отрисовать один объект в двух коллекциях?

Во-первых, задайте `bindRenderedAsSandbox` равным `false` в классе элемента. Это отключает автоматическую песочницу отрисованного объекта: у одного объекта не может быть двух песочниц.

Во-вторых, при отрисовке проверьте, какая коллекция отрисовала объект. Событие `render` (и метод `onRender`) получает коллекцию в свойстве `parentArray`.

Пример: класс `User` и две коллекции, `UsersA` и `UsersB`, у которых [`itemRenderer`](/ru/api/matreshka-array/item-renderer/) может различаться. Обе используют `User` как [`Model`](/ru/api/matreshka-array/model/).

```js
class User extends Matreshka.Object {
    constructor() {
        super();

        this.bindRenderedAsSandbox = false;

        setInterval(() => {
            // при изменении "name" меняются элементы в обеих коллекциях
            this.name = Math.random();
        }, 5000);
    }
    onRender(evt) {
        const { parentArray, node } = evt;

        if (parentArray instanceof UsersA) {
            this.bindNode({
                // ключ для отрисованного узла, чтобы селекторы ниже начинались с него
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

Привязки можно объявить и в классах коллекций: коллекция слушает событие `render` объектов, которые в неё вставляются.
