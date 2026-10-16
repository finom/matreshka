---
title: "Примеры"
description: "Примеры в одном HTML-файле для страниц с серверным рендерингом, Hello World шаг за шагом и живые приложения на Matreshka.js: TodoMVC, TreeView и другие."
---

# Примеры

## Примеры в одном HTML-файле

Каждый пример — это один HTML-файл: разметка, данные и скрипт. Бандл подключается одним тегом `<script>`, сборка не нужна.

::: examples
::: example /examples/signup-form/ https://github.com/finom/matreshka/tree/main/examples/signup-form Форма регистрации

Форма в том виде, в каком её отдал бы сервер, разметка не тронута: email проверяется прямо при вводе, полоска показывает надёжность пароля, а кнопка отправки неактивна, пока форма не заполнена правильно. Только обычные объекты, `bindNode` и `calc`.

:::
::: example /examples/product-table/ https://github.com/finom/matreshka/tree/main/examples/product-table Таблица товаров

Таблица по данным JSON, встроенным в страницу: поиск, сортировка, фильтр «в наличии» и счётчики. Строки отрисовывает `Matreshka.Array`.

:::
::: example /examples/price-widget/ https://github.com/finom/matreshka/tree/main/examples/price-widget Виджет цены

Калькулятор экономии, встроенный в чужую страницу. `bindSandbox` и селекторы `:sandbox` не дают ему выйти за пределы своего корня, а `mediate` превращает строки из полей в числа.

:::
:::

## Hello World

Первое приложение из двух файлов:

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

## Другие живые примеры

Каждый пример работает на этом сайте; его код лежит в [папке examples](https://github.com/finom/matreshka/tree/main/examples) репозитория.

::: examples
::: example /examples/todomvc/ https://github.com/finom/matreshka/tree/main/examples/todomvc TodoMVC

Список дел. Есть [исходный код с аннотациями](/examples/todomvc/docs/todomvc/js/app.html).

:::
::: example /examples/treeview/ https://github.com/finom/matreshka/tree/main/examples/treeview TreeView

Дерево элементов любой глубины вложенности.

:::
::: example /examples/markdown-editor/ https://github.com/finom/matreshka/tree/main/examples/markdown-editor Редактор Markdown

Редактор Markdown в несколько строк кода: предпросмотр обновляется при вводе.

:::
::: example /examples/contact-list/ https://github.com/finom/matreshka/tree/main/examples/contact-list Список контактов

Добавление, удаление, сортировка, поиск и редактирование контактов.

:::
::: example /examples/matreshka-object/ https://github.com/finom/matreshka/tree/main/examples/matreshka-object Форма входа

Форма входа на `Matreshka.Object`. В папке с кодом есть пошаговое руководство (на английском).

:::
::: example /examples/matreshka-array/ https://github.com/finom/matreshka/tree/main/examples/matreshka-array Таблица пользователей

Таблица пользователей на `Matreshka.Array`. В папке с кодом есть пошаговое руководство (на английском).

:::
::: example /examples/router/#!/foo/bar/baz/ https://github.com/finom/matreshka/tree/main/examples/router Демо роутера

Свойства, привязанные к частям URL.

:::
::: example /examples/parse-form/ https://github.com/finom/matreshka/tree/main/examples/parse-form Демо парсера форм

Поля формы, привязанные к свойствам по именам.

:::
:::

## Руководства

- [События](https://github.com/finom/matreshka/tree/main/examples/events) (на английском) – статья о механизме событий, на котором работают `calc`, `bindNode`, `instantiate` и другие методы.
- [`Matreshka.Object`](https://github.com/finom/matreshka/tree/main/examples/matreshka-object) и [`Matreshka.Array`](https://github.com/finom/matreshka/tree/main/examples/matreshka-array) шаг за шагом (на английском), с живыми примерами выше.
