# Matreshka.js examples and tutorials

Examples and tutorials for Matreshka.js, next to [the main documentation](https://matreshka.js.org/). Each one runs live at `https://matreshka.js.org/examples/<name>/`.

### Single-file examples

Each is one HTML file that loads the bundle with one `<script>` tag, with no build.

- [Signup form](./signup-form): a server-rendered form with its markup left as is. The email is checked as you type, a bar shows the password's strength, and the submit button stays disabled until the form is valid.
- [Product table](./product-table): a table rendered from JSON embedded in the page, with search, sorting, an in-stock filter and counts. A `Matreshka.Array` renders the rows.
- [Price widget](./price-widget): a widget on someone else's page. `bindSandbox` and `:sandbox` selectors keep it inside its own root, and `mediate` turns the fields' strings into numbers.

### Getting started

Start with [Hello World](./hello-world), the [Matreshka.Object example](./matreshka-object) and the [Matreshka.Array example](./matreshka-array). Then read an article about one of the most important parts of the framework: [the events](./events).

### Other examples
- [Contact List](./contact-list)
- [Markdown Editor](./markdown-editor)
- [Treeview](./treeview)
- [TodoMVC](./todomvc)
- [SoundCloud Search](./soundcloud-search) (its live demo no longer works: SoundCloud's API refuses the demo's client ID)
- [Router](./router) and [form parser](./parse-form) demos

The pages load the framework from the site root (`/matreshka.min.js`, with the router and the form parser in it). The docs build copies it, with these examples, into the site, so to run them locally build the site and serve `docs/out`:

```
npm run build
npm run build -w matreshka-docs
npx serve docs/out
```
