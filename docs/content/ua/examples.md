---
title: "Приклади"
description: "Приклади в одному HTML-файлі для сторінок із серверним рендерингом, Hello World крок за кроком і живі застосунки на Matreshka.js: TodoMVC, TreeView та інші."
---

# Приклади

## Приклади в одному HTML-файлі

Кожен приклад — це один HTML-файл: розмітка, дані й скрипт. Бандл підключається одним тегом `<script>`, збирання не потрібне.

::: examples
::: example /examples/signup-form/ https://github.com/finom/matreshka/tree/main/examples/signup-form Форма реєстрації

Форма в тому вигляді, в якому її віддав би сервер, розмітку не змінено: email перевіряється просто під час введення, смужка показує надійність пароля, а кнопка надсилання неактивна, доки форму не заповнено правильно. Лише звичайні об’єкти, `bindNode` і `calc`.

:::
::: example /examples/product-table/ https://github.com/finom/matreshka/tree/main/examples/product-table Таблиця товарів

Таблиця за даними JSON, вбудованими в сторінку: пошук, сортування, фільтр «є в наявності» й лічильники. Рядки відмальовує `Matreshka.Array`.

:::
::: example /examples/price-widget/ https://github.com/finom/matreshka/tree/main/examples/price-widget Віджет ціни

Калькулятор економії, вбудований у чужу сторінку. `bindSandbox` і селектори `:sandbox` не дають йому вийти за межі власного кореня, а `mediate` перетворює рядки з полів на числа.

:::
:::

## Hello World

Перший застосунок із двох файлів:

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
		<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
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

## Інші живі приклади

Кожен приклад працює на цьому сайті; його код лежить у [папці examples](https://github.com/finom/matreshka/tree/main/examples) репозиторію.

::: examples
::: example /examples/todomvc/ https://github.com/finom/matreshka/tree/main/examples/todomvc TodoMVC

Список справ. Є [код з анотаціями](/examples/todomvc/docs/todomvc/js/app.html).

:::
::: example /examples/treeview/ https://github.com/finom/matreshka/tree/main/examples/treeview TreeView

Дерево елементів будь-якої глибини вкладеності.

:::
::: example /examples/markdown-editor/ https://github.com/finom/matreshka/tree/main/examples/markdown-editor Редактор Markdown

Редактор Markdown на кількох рядках коду: попередній перегляд оновлюється під час введення.

:::
::: example /examples/contact-list/ https://github.com/finom/matreshka/tree/main/examples/contact-list Список контактів

Додавання, видалення, сортування, пошук і редагування контактів.

:::
::: example /examples/matreshka-object/ https://github.com/finom/matreshka/tree/main/examples/matreshka-object Форма входу

Форма входу на `Matreshka.Object`. У теці з кодом є покроковий посібник (англійською).

:::
::: example /examples/matreshka-array/ https://github.com/finom/matreshka/tree/main/examples/matreshka-array Таблиця користувачів

Таблиця користувачів на `Matreshka.Array`. У теці з кодом є покроковий посібник (англійською).

:::
::: example /examples/router/#!/foo/bar/baz/ https://github.com/finom/matreshka/tree/main/examples/router Демо роутера

Властивості, прив’язані до частин URL.

:::
::: example /examples/parse-form/ https://github.com/finom/matreshka/tree/main/examples/parse-form Демо парсера форм

Поля форми, прив’язані до властивостей за іменами.

:::
:::

## Посібники

- [Події](https://github.com/finom/matreshka/tree/main/examples/events) (англійською) – стаття про механізм подій, на якому працюють `calc`, `bindNode`, `instantiate` та інші методи.
- [`Matreshka.Object`](https://github.com/finom/matreshka/tree/main/examples/matreshka-object) і [`Matreshka.Array`](https://github.com/finom/matreshka/tree/main/examples/matreshka-array) крок за кроком (англійською), з живими прикладами вище.
