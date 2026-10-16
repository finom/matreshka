// **todo.js** contains the ``Todo`` class, which is inherited from the [Matreshka.Object](https://matreshka.js.org/#Matreshka.Object) class and used as a ([Model](https://matreshka.js.org/#Matreshka.Array-Model)) for the main class ([Todos](todos.html)).
class Todo extends Matreshka.Object {
    constructor(data, parent) {
        super();
        this
            // Assign the default values and add the keys ``"title"`` and ``"completed"`` to the list of the keys which are responsible for the data (see [setData](https://matreshka.js.org/#Matreshka.Object-setData)).
            // The ``"title"`` property by default is an empty string.
            // The ``"completed"`` property by default is ``false``.
            .setData({
                title: '',
                completed: false
            })
            // Now assign the data which the constructor has received as an argument, overwriting the default values  (for example, ``{ title: 'Do it!' }``).
            .set(data)
            // The ``"visible"`` property is responsible for the visibility of an element from the todo list on the page.
            // We're saving a reference to ``Todos`` instance in ``"parent"`` property
            .set({
                visible: true,
                parent
            });
    }

    // Wait for the ``"render"`` event using the [onRender](https://matreshka.js.org/#Matreshka.Array-onItemRender) virtual method. The event fires when the element corresponding to the instance of the class is rendered.
    onRender() {
        const { binders } = Matreshka;
        this
        // The binding of the elements that do not require the assignment of the binder (binder). The [defaultBinders](https://matreshka.js.org/#Matreshka.defaultBinders) are used here if it is possible.
        // * The ``"completed"`` property is bound to the checkbox with ``toggle`` class
        // * The ``"edit"`` property is bound to the field (``input type=text``) with ``edit`` class
        // * The ``"destroy"`` property is bound to the element with ``destroy`` class which does not have a default binder. It means that the element is simply associated with the property without synchronizing with its value.
            .bindNode({
                completed: ':sandbox .toggle',
                edit: ':sandbox .edit',
                destroy: ':sandbox .destroy'
            })
            // These bindings use the third argument as a binder.
            // * The visibility of the sandbox element will depend on the value of the ``"visible"`` property ([binders.display](https://matreshka.js.org/#Matreshka.binders.display))
            // * The presence of the ``"completed"`` class in the sandbox element will depend on the value of the ``"completed"`` property ([binders.className](https://matreshka.js.org/#Matreshka.binders.className))
            // * The presence of the ``"editing"`` class in the sandbox element will depend on the value of the ``"editing"`` property
            // * Bind the element ``label`` whose ``innerHTML`` will be synchronized with the value of the ``"title"`` property ([binders.html](https://matreshka.js.org/#Matreshka.binders.html))
            .bindNode('visible', ':sandbox', binders.display())
            .bindNode('completed', ':sandbox', binders.className('completed'))
            .bindNode('editing', ':sandbox', binders.className('editing'))
            .bindNode('title', ':sandbox label', binders.html())
            // Add the event handler of the mouse double click (``"dblclick"``) to the element bound to the ``"title"`` property (``label`` tag).
            // When the handler fires, we change the instance mode to the editing and assign the value ``true`` to the ``"editing"`` property. This action adds the ``"edit"`` class to the sandbox element (see bindings above).
            // Next we assign the current value of the ``"title"`` property to the ``"edit"`` property.
            // After that we take focus on the field bound to the ``"edit"`` property.
            .on('dblclick::title', () => {
                this.editing = true;
                this.edit = this.title;
                this.nodes.edit.focus();
            })
            // Add the ``"keyup"`` event handler to the element bound to the ``"edit"`` property.
            // If the ``Esc`` key is pressed, go back from the edit mode to the normal mode.
            // If the ``Enter`` key is pressed, delete unnecessary spaces from the ``"edit"`` property value and assign it to the ``"title"`` property. Then go back from the edit mode to the normal mode. If the value is an empty string, remove itsm from ``Todos`` instance.
            .on('keyup::edit', (evt) => {
                if (evt.which === ESC_KEY) {
                    this.editing = false;
                } else if (evt.which === ENTER_KEY) {
                    const editValue = this.edit.trim();

                    if (editValue) {
                        this.title = editValue;
                        this.editing = false;
                    } else {
                        this.parent.pull(this);
                    }
                }
            })
            // If we click on the element that is responsible for the item deletion, we delete this item from the ``Todos`` instance using the [pull](https://matreshka.js.org/#Matreshka.Array-pull) method.
            .on('click::destroy', () => {
                this.parent.pull(this);
            });
    }
}
