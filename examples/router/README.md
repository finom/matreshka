# matreshka/router demo

[Demo](https://matreshka.js.org/examples/router/#!/foo/bar/baz/)

Two-way binding between object properties and parts of the URL, with [`matreshka/router`](../../src/router). The first row of fields is bound to `location.hash`, the second one to the path through the History API.

The History API changes the page's path, and the demo starts at `/examples/router/`, so `d` and `e` start as `examples` and `router`. A path the demo writes is not a file on the server: reloading the page after typing into the second row answers 404.
