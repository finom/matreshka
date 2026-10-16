---
title: "Приклади"
description: "Hello World крок за кроком і живі додатки на Matreshka.js: TodoMVC, TreeView, редактор Markdown, список контактів, посібники та демо плагінів."
---

# Приклади

## Hello World

Написати перший додаток за допомогою фреймворка Matreshka.js дуже просто.

**1\.** Створіть HTML файл з наступним змістом

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Мій перший додаток на базі Matreshka.js</title>
	</head>
	<body>
		<input type="text" class="my-input">
		<div class="my-output"></div>
		<script src="https://cdn.jsdelivr.net/npm/matreshka@2/dist/matreshka.min.js"></script>
		<script src="js/app.js"></script>
	</body>
</html>
```

**2\.** Створіть клас у файлі **js/app.js**

```js
// присвоюємо html байндер змінній з коротким ім'ям
const htmlBinder = Matreshka.binders.html;

// створюємо клас, який успадковується від Matreshka
class Application extends Matreshka {
    constructor() {
        super();

        // пов'язуємо властивість x і текстове поле
        this.bindNode('x', '.my-input');

        // пов'язуємо властивість x і блок з класом my-output
        this.bindNode('x', '.my-output', htmlBinder());

        // слухаємо зміни властивості x
        this.on('change:x', () =>
            console.log(`x змінений на "${this.x}"`));
    }
}

const app = new Application();
```

**3\.** Це все!

Тепер можете відкрити консоль розробника (клавіша F12) і написати:

```js
app.x = 'Hello World!';
```

[Запустити приклад](/examples/hello-world/).

### Посилання

- [Клас `Matreshka`](/ua/api/matreshka/)
- [Метод `Matreshka#bindNode`](/ua/api/matreshka/bind-node/)
- [Метод `Matreshka#on`](/ua/api/matreshka/on/)

## Живі приклади

Кожен приклад працює на цьому сайті; його код лежить у [папці examples](https://github.com/finom/matreshka/tree/main/examples) репозиторію.

1. [TodoMVC](/examples/todomvc/) – список справ. ([Код з анотаціями](/examples/todomvc/docs/todomvc/js/app.html), [код](https://github.com/finom/matreshka/tree/main/examples/todomvc))
2. [TreeView](/examples/treeview/) – деревовидний список необмеженої вкладеності. ([Код](https://github.com/finom/matreshka/tree/main/examples/treeview))
3. [Markdown editor](/examples/markdown-editor/) – найпростіший редактор Markdown. ([Код](https://github.com/finom/matreshka/tree/main/examples/markdown-editor))
4. [Contact List](/examples/contact-list/) – дозволяє додавати, видаляти, сортувати, змінювати і шукати контакти. ([Код](https://github.com/finom/matreshka/tree/main/examples/contact-list))
5. [Форма входу](/examples/matreshka-object/) на `Matreshka.Object`. ([Посібник](https://github.com/finom/matreshka/tree/main/examples/matreshka-object), англійською)
6. [Таблиця користувачів](/examples/matreshka-array/) на `Matreshka.Array`. ([Посібник](https://github.com/finom/matreshka/tree/main/examples/matreshka-array), англійською)
7. [Демо matreshka-router](/examples/router/#!/foo/bar/baz/) – властивості, зв’язані з частинами URL. ([Код](https://github.com/finom/matreshka/tree/main/examples/router))
8. [Демо matreshka-parse-form](/examples/parse-form/) – поля форми, зв’язані з властивостями за іменами. ([Код](https://github.com/finom/matreshka/tree/main/examples/parse-form))

## Посібники

- [Події](https://github.com/finom/matreshka/tree/main/examples/events) (англійською) – стаття про механізм подій, на якому працюють `calc`, `bindNode`, `instantiate` та інші методи.
- [`Matreshka.Object`](https://github.com/finom/matreshka/tree/main/examples/matreshka-object) і [`Matreshka.Array`](https://github.com/finom/matreshka/tree/main/examples/matreshka-array) крок за кроком (англійською), з живими прикладами вище.
