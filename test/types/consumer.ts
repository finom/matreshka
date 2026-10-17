// A user's TypeScript file: check-dist type-checks it against the packed tarball. A line under @ts-expect-error
// must fail to compile.
import Matreshka, {
  type Binder,
  type BindNodeOptions,
  type CalcHandler,
  type EventHandler,
  type EventOptions,
  type ItemRenderer,
  type Mediator,
  MatreshkaArray,
  MatreshkaObject,
  bindNode,
  binders,
  calc,
  mediate,
  on,
  set,
  toMatreshka
} from 'matreshka';
import { Router, initRouter, type RouterType } from 'matreshka/router';
import { parseForm } from 'matreshka/parse-form';

// a class that inherits Matreshka
class App extends Matreshka {
  x = '';
  constructor() {
    super();
    this.bindNode('x', '.my-input')
      .bindNode('x', '.my-output', binders.html())
      .on('change:x', (evt: EventOptions) => console.log(evt.value))
      .calc('y', 'x', (x: string) => x.length)
      .mediate('x', String);
  }
}
const app: App = new App();
const node: Node | undefined = app.nodes.x;
const nodes: Node[] | undefined = app.$nodes.x;
app.set('x', 'a', { silent: true }).set({ x: 'b' });
app.trigger('custom', 1, 2);
app.off('change:x');
app.select('.a');
const found: Node[] = app.$('.b');

// the static functions work on any object
const plain = { a: 1, b: 2 };
calc(plain, 'sum', ['a', 'b'], (a: number, b: number) => a + b);
bindNode(plain, 'a', document.createElement('input'), null, { debounceSetValue: false });
mediate(plain, 'a', Number);
on(plain, 'change:a', () => {});
const same: typeof plain = set(plain, 'a', 3);

// Matreshka.Object with typed data
const user = new MatreshkaObject<{ name: string; age: number }>({ name: 'Ann' });
user.setData('age', 30);
// @ts-expect-error: age is a number
user.setData('age', 'thirty');
// @ts-expect-error: no such data key
user.setData('nope', 1);
const keys: ('name' | 'age')[] = user.keys();
const userValues: (string | number)[] = [];
for (const value of user) userValues.push(value);
for (const value of user[Symbol.iterator]()) userValues.push(value);
const json: { name: string; age: number } = user.toJSON();

// an untyped Matreshka.Object takes any key
const loose = new MatreshkaObject({ a: 1 });
loose.setData('b', 'two');

// Matreshka.Array with a Model and a renderer
class Todo extends MatreshkaObject<{ title: string; done: boolean }> {
  constructor(data?: Partial<{ title: string; done: boolean }>) {
    super(data);
  }
}
class Todos extends MatreshkaArray<Todo> {
  override get Model() {
    return Todo;
  }
  // itemRenderer is not declared by the library (a method, a getter or a field all work), so no override
  itemRenderer: ItemRenderer = '<li>{{title}}</li>';
  constructor() {
    super();
    this.bindNode('container', '.todos');
  }
}
const todos = new Todos();
todos.push(new Todo({ title: 'a' }));
const first: Todo | undefined = todos.at(0);
const titles: MatreshkaArray<string> = todos.map((todo) => todo.title as string);
const sorted: MatreshkaArray<Todo> = todos.toSorted();
const flat: MatreshkaArray<number> = MatreshkaArray.of([1], [2]).flat();
const last: Todo | undefined = todos.findLast(() => true);
const todoItems: Todo[] = [];
for (const todo of todos) todoItems.push(todo);
for (const todo of todos[Symbol.iterator]()) todoItems.push(todo);
todos.recreate([{ title: 'b' }]);
todos.push({ done: true }, new Todo());
// @ts-expect-error: title is a string
todos.push({ title: 1 });
const numbers = new MatreshkaArray(1, 2);
// @ts-expect-error: an array of numbers takes numbers
numbers.push('three');
todos.orderBy('title', 'desc');
const removed: Todo | null = todos.pull(0);
const spread: Todo[] = [...todos];
const fromArray = MatreshkaArray.from([1, 2, 3], (x) => x * 2);
const converted = toMatreshka({ a: [1, 2] });

// a custom binder and the option types
const uiSlider = (min: number, max: number): Binder => ({
  on: 'slide',
  getValue() {
    return Number((this as HTMLInputElement).value);
  },
  setValue(value: number) {
    (this as HTMLInputElement).value = String(Math.min(max, Math.max(min, value)));
  },
  initialize(options) {
    (this as Element).setAttribute('data-key', options.key);
  },
  destroy() {}
});
Matreshka.binders.uiSlider = uiSlider;
const options: BindNodeOptions = { debounceSetValue: false, getValueOnBind: true, useExactBinder: true };
const handler: EventHandler = () => {};
const calcHandler: CalcHandler = (a: number) => a;
const mediator: Mediator = (value) => Number(value);
bindNode(plain, 'b', '.slider', uiSlider(0, 100), options);

// the default export carries the classes and the statics
const ArrayClass: typeof MatreshkaArray = Matreshka.Array;
const ObjectClass: typeof MatreshkaObject = Matreshka.Object;
Matreshka.bindNode(plain, 'a', '.a');
const MyClass = Matreshka.Class({
  extends: Matreshka,
  constructor() {}
});

// the router and the form parser
const routed = initRouter({ a: '', b: '' }, '/a/b/');
const type: RouterType = 'history';
const router = new Router(type).subscribe(routed, 'a/b');
const path: string = router.path;
const form: Element | null = parseForm({}, '.my-form', (name, field) => field.getAttribute(name));
// @ts-expect-error: parseForm takes an object
parseForm('nope', '.my-form');

// the documented forms sweep 4 found rejected
// Class: `this` in the prototype is the instance, the parent's methods included
const ArrayClass2 = Matreshka.Class({
  extends: Matreshka.Array,
  constructor(items: number[]) {
    this.recreate(items).sayHello();
  },
  sayHello(): string {
    return 'hi';
  }
});
const classed: string = new ArrayClass2([1]).sayHello();
// itemRenderer as a method, a field, or set in the constructor
class MethodRenderer extends MatreshkaArray {
  itemRenderer() {
    return '<li></li>';
  }
}
class FieldRenderer extends MatreshkaArray {
  itemRenderer = '<li></li>';
}
class SetRenderer extends MatreshkaArray {
  constructor() {
    super();
    this.itemRenderer = (item: { a: string }) => `<li>${item.a}</li>`;
    this.itemRenderer = null;
  }
}
class GetterRenderer extends MatreshkaArray {
  get itemRenderer() {
    return ':sandbox .renderer';
  }
}
const renderers = [new MethodRenderer(), new FieldRenderer(), new SetRenderer(), new GetterRenderer()];
// a handler gets the context passed to on() as this
app.on(
  'foo',
  function () {
    return this.a;
  },
  { a: 5 }
);
// items of different types
const mixed = new MatreshkaArray('Hi', { a: 'b' });
// @ts-expect-error: an explicit item type is still checked
new MatreshkaArray<number>('x');
// from and of on a subclass give the subclass
class Greeting extends MatreshkaArray {
  sayHello() {}
}
const greetings: Greeting = Greeting.of(1, 2);
const fromGreetings: Greeting = Greeting.from([1, 2]);
const fromNumbers: number = MatreshkaArray.from([1, 2])[0];
const mapped: string = MatreshkaArray.from([1, 2], (value) => String(value))[0];
// a router of its own type
const ownRouter: Router = new Router('custom');
// unbindNode items may leave the node out
app.unbindNode([{ key: 'x' }, { key: 'x', node: '.my-input' }]);
// @ts-expect-error: bindNode items need a node
app.bindNode([{ key: 'x' }]);

export {
  app,
  node,
  nodes,
  found,
  same,
  keys,
  userValues,
  todoItems,
  json,
  first,
  titles,
  sorted,
  flat,
  last,
  removed,
  spread,
  fromArray
};
export { classed, renderers, mixed, greetings, fromGreetings, fromNumbers, mapped, ownRouter };
export { converted, handler, calcHandler, mediator, ArrayClass, ObjectClass, MyClass, path, form };
