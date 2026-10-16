---
title: "Примеры"
description: "Hello World шаг за шагом и живые приложения на Matreshka.js: TodoMVC, TreeView, редактор Markdown, список контактов, руководства и демо плагинов."
---

# Примеры

## Hello World

Написать первое приложение с помощью фреймворка Matreshka.js очень просто.

**1\.** Создайте HTML файл со следующим содержимым

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Моё первое приложение на базе Matreshka.js</title>
	</head>
	<body>
		<input type="text" class="my-input">
		<div class="my-output"></div>
		<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
		<script src="js/app.js"></script>
	</body>
</html>
```

**2\.** Создайте класс в файле **js/app.js**

```js
// сохраняем html байндер в переменную с коротким именем
const htmlBinder = Matreshka.binders.html;

// создаём класс, который наследуется от Matreshka
class Application extends Matreshka {
    constructor() {
        super();

        // связываем свойство x и текстовое поле
        this.bindNode('x', '.my-input');

        // связываем свойство x и блок с классом my-output
        this.bindNode('x', '.my-output', htmlBinder());

        // слушаем изменения свойства x
        this.on('change:x', () =>
            console.log(`x изменен на "${this.x}"`));
    }
}

const app = new Application();
```

**3\.** Это всё!

Теперь можете открыть консоль разработчика (клавиша F12) и написать:

```js
app.x = 'Hello World!';
```

[Запустить пример](/examples/hello-world/).

### Ссылки

- [Класс `Matreshka`](/ru/api/matreshka/)
- [Метод `Matreshka#bindNode`](/ru/api/matreshka/bind-node/)
- [Метод `Matreshka#on`](/ru/api/matreshka/on/)

## Живые примеры

Каждый пример работает на этом сайте; его код лежит в [папке examples](https://github.com/finom/matreshka/tree/main/examples) репозитория.

1. [TodoMVC](/examples/todomvc/) – список дел. ([Исходный код с аннотациями](/examples/todomvc/docs/todomvc/js/app.html), [код](https://github.com/finom/matreshka/tree/main/examples/todomvc))
2. [TreeView](/examples/treeview/) – древовидный список неограниченной вложенности. ([Код](https://github.com/finom/matreshka/tree/main/examples/treeview))
3. [Markdown editor](/examples/markdown-editor/) – простейший редактор Markdown. ([Код](https://github.com/finom/matreshka/tree/main/examples/markdown-editor))
4. [Contact List](/examples/contact-list/) – позволяет добавлять, удалять, сортировать, менять и искать контакты. ([Код](https://github.com/finom/matreshka/tree/main/examples/contact-list))
5. [Форма входа](/examples/matreshka-object/) на `Matreshka.Object`. ([Руководство](https://github.com/finom/matreshka/tree/main/examples/matreshka-object), на английском)
6. [Таблица пользователей](/examples/matreshka-array/) на `Matreshka.Array`. ([Руководство](https://github.com/finom/matreshka/tree/main/examples/matreshka-array), на английском)
7. [Демо matreshka/router](/examples/router/#!/foo/bar/baz/) – свойства, связанные с частями URL. ([Код](https://github.com/finom/matreshka/tree/main/examples/router))
8. [Демо matreshka/parse-form](/examples/parse-form/) – поля формы, связанные со свойствами по именам. ([Код](https://github.com/finom/matreshka/tree/main/examples/parse-form))
9. [Форма регистрации](/examples/signup-form/) – форма, отрисованная на сервере: email проверяется при вводе, полоска показывает надёжность пароля. ([Код](https://github.com/finom/matreshka/tree/main/examples/signup-form))
10. [Таблица товаров](/examples/product-table/) – поиск, сортировка и фильтр по строкам, которые отрисовывает `Matreshka.Array`. ([Код](https://github.com/finom/matreshka/tree/main/examples/product-table))
11. [Виджет цены](/examples/price-widget/) – виджет на чужой странице, который `bindSandbox` держит внутри его корня. ([Код](https://github.com/finom/matreshka/tree/main/examples/price-widget))

## Руководства

- [События](https://github.com/finom/matreshka/tree/main/examples/events) (на английском) – статья о механизме событий, на котором работают `calc`, `bindNode`, `instantiate` и другие методы.
- [`Matreshka.Object`](https://github.com/finom/matreshka/tree/main/examples/matreshka-object) и [`Matreshka.Array`](https://github.com/finom/matreshka/tree/main/examples/matreshka-array) шаг за шагом (на английском), с живыми примерами выше.
