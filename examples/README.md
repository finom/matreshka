# Matreshka.js examples and tutorials

Examples and tutorials for Matreshka.js, next to [the main documentation](https://matreshka.js.org/). Each one runs live at `https://matreshka.js.org/examples/<name>/`.

Start with [Hello World](./hello-world), the [Matreshka.Object example](./matreshka-object) and the [Matreshka.Array example](./matreshka-array). Then read an article about one of the most important parts of the framework: [the events](./events).

### Other examples
- [Contact List](./contact-list)
- [Markdown Editor](./markdown-editor)
- [Treeview](./treeview)
- [TodoMVC](./todomvc)
- [SoundCloud Search](./soundcloud-search) (its live demo no longer works: SoundCloud's API refuses the demo's client ID)
- [matreshka-router](./router) and [matreshka-parse-form](./parse-form) demos

The pages load the framework from the site root (`/matreshka.min.js`, `/matreshka-router.min.js`, `/matreshka-parse-form.min.js`). The docs build copies them, with these examples, into the site, so to run them locally build the site and serve `docs/out`:

```
npm run build
npm run build -w matreshka-docs
npx serve docs/out
```
