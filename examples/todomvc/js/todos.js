// **todos.js** - is the largest file in this app which contains most of logic. In bigger projects it is better to divide applications into smaller parts.
class Todos extends Matreshka.Array {
    // [Model](https://matreshka.js.org/api/matreshka-array/model/) defines the class of items which will be included into the collection. In this case, the items of the collection will be instances of the [Todo](todo.html) class.
    get Model() {
        return Todo;
    }
    // Defining the [itemRenderer](https://matreshka.js.org/api/matreshka-array/item-renderer/) property, you create a renderer for every added item of the array (see HTML code).
    get itemRenderer() {
        return '#todo_item_template';
    }

    constructor() {
        super();
        this
            // Add the dependency of the ``"leftLength"`` property on ``"length"`` and ``"completedLength"`` ones, and use their difference as a value. The application listens to the changes in these properties calculating ``“leftLength"`` on every their changing.
            .calc('leftLength', ['length', 'completedLength'], (length, completedLength) => length - completedLength)
            // The ``"bindings"`` method adds data bindings between the properties of the class instance and DOM nodes. The ``"events"`` method, as you may guess, adds the event handlers. These names of the methods are not special; they group different actions for the code purity. After their launching, take the data out of the local storage and restore the todo items from it using [recreate](https://matreshka.js.org/api/matreshka-array/recreate/) method. After all we initialize [a router](https://github.com/finom/matreshka/tree/main/packages/router).

            .bindings()
            .events()
            .recreate(JSON.parse(localStorage['todos-matreshka'] || '[]'));

        Matreshka.initRouter(this, '/state/');
    }

    bindings() {
        const { binders } = Matreshka;
        return this
            // Declare a sandbox.
            .bindNode('sandbox', '.todoapp')
            // Bind some other nodes (``main``, ``footer``, etc.).
            .bindNode({
                main: ':sandbox .main',
                footer: ':sandbox .footer',
                newTodo: ':sandbox .new-todo',
                container: ':sandbox .todo-list',
                allCompleted: ':sandbox .toggle-all',
                clearCompleted: ':sandbox .clear-completed'
            })
            // The next call of [bindNode](https://matreshka.js.org/api/matreshka/bind-node/) makes the visibility of HTML nodes dependable on the values of corresponding properties (if the value passes a non-strict test for equality ``true``, the element will be shown, otherwise - hidden).
            .bindNode({
                completedLength: ':bound(clearCompleted)',
                length: ':bound(main), :bound(footer)'
            }, binders.display())
            // The next two bindings change inner HTML of the bound nodes depending on a value of the corresponding properties.
            .bindNode('completedLength', ':bound(clearCompleted) .completed-length', binders.html())
            .bindNode('leftLength', '.todo-count', {
                setValue(v) {
                    this.innerHTML = `<strong>${v}</strong> item${v !== 1 ? 's' : ''} left`;
                }
            })
            // This binding controls which exact link (“All”, “Active”, “Completed”) will be highlighted in bold. The following technique has been used for demonstrating the work of ``bindNode`` here: we bind the ``#filters`` element to the ``"state"`` property, but in the binder we manipulate the links inside this element.
            .bindNode('state', '.filters', {
                setValue(v) {
                    const links = [...this.querySelectorAll('a')];

                    for (let link of links) {
                        link.classList.toggle('selected', link.getAttribute('href') === `#!/${v || ''}`);
                    }
                }
            });
    }

    events() {
        return this
            // Add an event handler to the changing of the ``"JSON"`` property which keeps the representation of the todo list as JSON string. In order to access a hard drive as rare as possible (because it works slower than RAM), the [onDebounce](https://matreshka.js.org/api/matreshka/on-debounce/) method is used, it prevents a multiple invocation of a handler over a period of time.
            .onDebounce('change:JSON', (evt) => {
                localStorage['todos-matreshka'] = evt.value;
            })
            // If the Enter key is pressed in the input bound to the ``“newTodo"`` property and the trimmed value of this property is not an empty string, add a new todo item using the ``push`` method.
            .on('keyup::newTodo', (evt) => {
                if (evt.which === ENTER_KEY) {
                    const newTodo = this.newTodo.trim();

                    if (newTodo) {
                        this.push({
                            title: newTodo
                        });
                    }

                    this.newTodo = '';
                }
            })
            // When the value of the ``"allCompleted"`` property is changed, we change ``"completed"`` for all todo items to the same value. The ``"silent"`` flag means that the ``"change:completed"`` event must not be triggered.
            .on('change:allCompleted', (evt) => {
                for (let todo of this) {
                    todo.set('completed', evt.value, {
                        silent: true
                    });
                }

                this.completedLength = evt.value ? this.length : 0;
            })
            // A mouse click on the ``'#clear-completed'`` node deletes all the performed items using the [pull](https://matreshka.js.org/api/matreshka-array/pull/) method.
            .on('click::clearCompleted', () => {
                for (let i = 0; i < this.length; i++) {
                    if (this[i].completed) {
                        this.pull(i--);
                    }
                }
            })
            // The next handler is called by two events. The first one is ``"modify"`` which fires when ``Matreshka.Array`` is changed (when some elements are added or deleted). The second one is ``"*@change:completed"`` which means that we listen to the ``"change:completed"`` event for every item of todo list. As a result, the handler calls when an item is added or deleted and when the ``"completed"`` property of one of the items is changed. The code of the handler is self-explanatory: ``"allCompleted"`` becomes equal ``true`` if every item is performed and inversely – ``false`` when some item is not performed. Then the value of the ``"completedLength"`` property is calculated, which contains a number of the performed items.
            .on('modify *@change:completed', () => {
                this.set('allCompleted', this.every(todo => todo.completed), {
                    silent: true
                });

                this.completedLength = this.filter(todo => todo.completed).length;
            })
            // If some items have been added or deleted or the ``"completed"`` property of one of the items has been changed or the value of the ``"allCompleted"`` property has been changed, prepare the representation of our todo list in order to place it into the ``localStorage`` afterwards.
            .on('modify *@change:completed change:allCompleted', () => {
                this.JSON = JSON.stringify(this);
            })
            // The next strings control how the visibility of the items from the todo list is controlled by ``location.hash`` (or the ``"state"`` property). This part can be implemented in several ways. The way of adding dependencies of one property on the others using the [calc](https://matreshka.js.org/api/matreshka/calc/) method has been chosen here. What happens here? We listen to the ``"addone"`` event which fires when a new item is added to the todo list. The event handler receives the object (``evt``) as an argument containing the ``"addedItem"`` property which is the added item. We add the dependency of the ``"visible"`` property for the added item on ``todos.state`` and on the own ``"completed"`` property.
            .on('addone', (evt) => {
                const todo = evt.addedItem;

                todo.calc('visible', [{
                    object: todo,
                    key: 'completed'
                }, {
                    object: this,
                    key: 'state'
                }], (completed, state) => !state
                        || (state === 'completed' && completed)
                        || (state === 'active' && !completed));
            });
    }
}
