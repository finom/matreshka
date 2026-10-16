// store html binder in a short variable
const htmlBinder = Matreshka.binders.html;

// create a class that inherits Matreshka
class Application extends Matreshka {
    constructor() {
        super();

        // bind the property x and the text field
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

app.x = 'Hello World!';
