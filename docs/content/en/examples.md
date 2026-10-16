---
title: "Examples"
description: "Single-file examples for server-rendered pages, then Hello World step by step and live apps built with Matreshka.js: TodoMVC, TreeView, a contact list."
---

# Examples

## Single-file examples

Each is one HTML file: the markup, the data and a script that loads the bundle with one `<script>` tag, with no build.

::: examples
::: example /examples/signup-form/ https://github.com/finom/matreshka/tree/main/examples/signup-form Signup form

A form as a server would render it, with the markup left as is: the email is checked as you type, a bar shows the password's strength, and the submit button stays disabled until the form is valid. Plain objects, `bindNode` and `calc`.

:::
::: example /examples/product-table/ https://github.com/finom/matreshka/tree/main/examples/product-table Product table

A table rendered from JSON embedded in the page, with search, sorting, an in-stock filter and counts. A `Matreshka.Array` renders the rows.

:::
::: example /examples/price-widget/ https://github.com/finom/matreshka/tree/main/examples/price-widget Price widget

A savings calculator placed on someone else's page. `bindSandbox` and `:sandbox` selectors keep it inside its own root, and `mediate` turns the fields' strings into numbers.

:::
:::

## Hello World

A first application in two files:

**1\.** Create an HTML file with the following content

```html
<!DOCTYPE html>
<html>
	<head>
		<title>My first Matreshka.js application</title>
	</head>
	<body>
		<input type="text" class="my-input">
		<div class="my-output"></div>
		<script src="https://cdn.jsdelivr.net/npm/matreshka@3/dist/matreshka.min.js"></script>
		<script src="js/app.js"></script>
	</body>
</html>
```

**2\.** Create the application class at **js/app.js**

```js
// store html binder in a short variable
const htmlBinder = Matreshka.binders.html;

// create the class which inherits Matreshka
class Application extends Matreshka {
    constructor() {
        super();

        // bind a property x and the text field
        this.bindNode('x', '.my-input');

        // bind the property x and the ".my-output" block
        this.bindNode('x', '.my-output', htmlBinder());

        // if the property "x" has changed,
        // inform about it in the console
        this.on('change:x', () =>
            console.log(`x is changed to "${this.x}"`));
    }
}

const app = new Application();
```

**3\.** That's it!

Now you can open the developer's console (by pressing F12) and write:

```js
app.x = 'Hello World!';
```

The field and the block show the new value, and the console logs the change. [Run it live](/examples/hello-world/).

### Links

- [`Matreshka` class](/api/matreshka/)
- [`Matreshka#bindNode` method](/api/matreshka/bind-node/)
- [`Matreshka#on` method](/api/matreshka/on/)

## More live examples

Each example runs on this site; its source code is in the [examples folder](https://github.com/finom/matreshka/tree/main/examples) of the repository.

::: examples
::: example /examples/todomvc/ https://github.com/finom/matreshka/tree/main/examples/todomvc TodoMVC

A to-do list. Read the [annotated source](/examples/todomvc/docs/todomvc/js/app.html).

:::
::: example /examples/treeview/ https://github.com/finom/matreshka/tree/main/examples/treeview TreeView

A tree of items nested to any depth. Each node renders its own children.

:::
::: example /examples/markdown-editor/ https://github.com/finom/matreshka/tree/main/examples/markdown-editor Markdown editor

A Markdown editor in a few lines of code: the preview updates as you type.

:::
::: example /examples/contact-list/ https://github.com/finom/matreshka/tree/main/examples/contact-list Contact list

Add, remove, sort, search and edit contacts.

:::
::: example /examples/matreshka-object/ https://github.com/finom/matreshka/tree/main/examples/matreshka-object Login form

A login form built with `Matreshka.Object`. The source folder has a step-by-step tutorial.

:::
::: example /examples/matreshka-array/ https://github.com/finom/matreshka/tree/main/examples/matreshka-array Table of users

A table of users built with `Matreshka.Array`. The source folder has a step-by-step tutorial.

:::
::: example /examples/router/#!/foo/bar/baz/ https://github.com/finom/matreshka/tree/main/examples/router Router demo

Properties bound to parts of the URL.

:::
::: example /examples/parse-form/ https://github.com/finom/matreshka/tree/main/examples/parse-form Form parser demo

Form fields bound to properties by their names.

:::
:::

## Tutorials

- [The events](https://github.com/finom/matreshka/tree/main/examples/events) – an article about the event engine, which powers `calc`, `bindNode`, `instantiate` and the rest.
- [`Matreshka.Object`](https://github.com/finom/matreshka/tree/main/examples/matreshka-object) and [`Matreshka.Array`](https://github.com/finom/matreshka/tree/main/examples/matreshka-array) step by step, with the live examples above.
